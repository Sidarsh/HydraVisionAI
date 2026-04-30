import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# Setup paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KNOWLEDGE_BASE_DIR = os.path.join(BASE_DIR, "knowledge_base")
INDEX_PATH = os.path.join(KNOWLEDGE_BASE_DIR, "faiss_index.bin")
DOCS_PATH = os.path.join(KNOWLEDGE_BASE_DIR, "docs.npy")

# We use a lightweight open-source embedding model
MODEL_NAME = 'all-MiniLM-L6-v2'
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model

def load_documents():
    """Reads all markdown files in the knowledge base and splits them into chunks."""
    documents = []
    if not os.path.exists(KNOWLEDGE_BASE_DIR):
        print(f"Knowledge base directory not found: {KNOWLEDGE_BASE_DIR}")
        return documents

    for filename in os.listdir(KNOWLEDGE_BASE_DIR):
        if filename.endswith(".md"):
            filepath = os.path.join(KNOWLEDGE_BASE_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                # Simple chunking by paragraph
                chunks = [chunk.strip() for chunk in content.split('\n\n') if chunk.strip()]
                for chunk in chunks:
                    documents.append(f"[{filename}] {chunk}")
    return documents

def build_index():
    """Builds the FAISS index from the knowledge base documents."""
    docs = load_documents()
    if not docs:
        print("No documents found to index.")
        return

    print("Generating embeddings for knowledge base...")
    model = get_model()
    embeddings = model.encode(docs)
    
    # FAISS expects float32
    embeddings = np.array(embeddings).astype('float32')
    
    # Create a dense vector index (L2 distance)
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    
    # Save the index and the documents
    faiss.write_index(index, INDEX_PATH)
    np.save(DOCS_PATH, docs)
    print(f"Successfully built and saved FAISS index with {len(docs)} chunks.")

def retrieve_context(query, k=2):
    """Retrieves top-k relevant context chunks for a given query."""
    if not os.path.exists(INDEX_PATH) or not os.path.exists(DOCS_PATH):
        print("Index not found. Building index now...")
        build_index()
        if not os.path.exists(INDEX_PATH): # If still not there, return empty
            return ""

    index = faiss.read_index(INDEX_PATH)
    docs = np.load(DOCS_PATH, allow_pickle=True)
    
    model = get_model()
    query_embedding = model.encode([query]).astype('float32')
    
    distances, indices = index.search(query_embedding, k)
    
    results = []
    for idx in indices[0]:
        if idx != -1 and idx < len(docs):
            results.append(docs[idx])
            
    return "\n\n".join(results)

if __name__ == "__main__":
    # Run this script directly to build the index
    build_index()
