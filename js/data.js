// ============================================
// DEFAULT DATA — Pre-populated from Tamal's CV
// ============================================

const DEFAULT_PROFILE = {
  name: "Tamal Kumar Sarker",
  title: "AI / ML Engineer",
  tagline: "Building intelligent systems with NLP, Computer Vision & LLMs",
  bio: "AI Engineer experienced in developing scalable NLP, computer vision, and multimodal systems using cutting-edge models and frameworks. Passionate about solving real-world problems with LLMs, Hugging Face, and Transformer-based architectures. Currently working as a Machine Learning Engineer at Adorsho Pranisheba Limited, developing computer vision solutions for the agricultural sector.",
  email: "tamalsarker534@gmail.com",
  phone: "+8801620617944",
  location: "Dhaka, Bangladesh",
  github: "https://github.com/TamalSarker777",
  linkedin: "#",
  profileImage: ""
};

const DEFAULT_SKILLS = [
  {
    category: "Programming",
    icon: "💻",
    items: [
      { name: "Python", level: 95 },
      { name: "JavaScript", level: 75 },
      { name: "SQL / MySQL", level: 70 }
    ]
  },
  {
    category: "AI/ML Frameworks",
    icon: "🧠",
    items: [
      { name: "PyTorch", level: 90 },
      { name: "TensorFlow", level: 85 },
      { name: "Hugging Face", level: 90 },
      { name: "OpenCV", level: 85 },
      { name: "Streamlit", level: 80 },
      { name: "Gradio", level: 75 }
    ]
  },
  {
    category: "LLM & RAG Tools",
    icon: "🔗",
    items: [
      { name: "LangChain", level: 90 },
      { name: "LangGraph", level: 85 },
      { name: "RAG Pipelines", level: 88 },
      { name: "Vector Stores (FAISS, Chroma)", level: 82 },
      { name: "OpenAI APIs", level: 85 }
    ]
  },
  {
    category: "NLP",
    icon: "📝",
    items: [
      { name: "Text Classification", level: 90 },
      { name: "Summarization", level: 85 },
      { name: "Sentiment Analysis", level: 85 },
      { name: "BERT / Transformers", level: 88 },
      { name: "Token Classification", level: 82 }
    ]
  },
  {
    category: "Computer Vision",
    icon: "👁️",
    items: [
      { name: "YOLO (Object Detection)", level: 90 },
      { name: "CNN / ResNet", level: 85 },
      { name: "Vision Transformer (ViT)", level: 82 },
      { name: "Image Segmentation", level: 80 },
      { name: "Pose Estimation", level: 75 }
    ]
  },
  {
    category: "DevOps & Deployment",
    icon: "🚀",
    items: [
      { name: "FastAPI", level: 88 },
      { name: "Docker", level: 75 },
      { name: "Git", level: 85 },
      { name: "AWS", level: 70 }
    ]
  }
];

const DEFAULT_EXPERIENCE = [
  {
    id: "exp1",
    role: "Machine Learning Engineer",
    company: "Adorsho Pranisheba Limited",
    period: "December 2024 – Present",
    location: "Dhaka, Bangladesh",
    highlights: [
      "Developed a cattle weight estimation system using YOLO and regression modeling from side-view images",
      "Prepared, labeled, and augmented datasets for training computer vision models",
      "Collaborating on an estrus cycle detection pipeline using time-series analysis and behavioral pattern tracking",
      "Conducted end-to-end model development including evaluation, model selection, and inference integration using OpenCV and PyTorch"
    ]
  }
];

const DEFAULT_PROJECTS = [
  {
    id: "proj1",
    name: "AI-Driven Exam Evaluation System",
    description: "End-to-end AI-powered exam evaluation platform integrating automated question generation, semantic + rubric-based response evaluation, and real-time feedback. Implemented RAG with ChromaDB for topic/PDF-based question generation. Designed dual evaluation engine: embedding-based cosine similarity scoring + LLM-driven grading with structured feedback.",
    tech: ["LangGraph", "LangChain", "OpenAI", "RAG", "ChromaDB", "FastAPI"],
    image: "",
    github: "",
    demo: ""
  },
  {
    id: "proj2",
    name: "AI Voice Sales Agent",
    description: "Interactive voice-based sales assistant using OpenAI Whisper (STT), GPT-4o-mini-TTS, and LangChain with RAG. Built a FastAPI backend and Streamlit frontend enabling real-time voice conversations and PDF-driven dynamic context.",
    tech: ["OpenAI Whisper", "GPT-4o-mini-TTS", "LangChain", "RAG", "FastAPI", "Streamlit"],
    image: "",
    github: "",
    demo: ""
  },
  {
    id: "proj3",
    name: "ConverseAI – Intelligent RAG Chatbot",
    description: "Conversational chatbot supporting model selection (Llama2, Code Llama), personality modes, knowledge upload (PDF/URL), temperature control, and conversational memory for dynamic, context-aware interactions.",
    tech: ["LangChain", "Hugging Face", "Streamlit", "RAG", "LLMs"],
    image: "",
    github: "https://github.com/TamalSarker777/Q-A-chatbot-pdf-websites",
    demo: ""
  },
  {
    id: "proj4",
    name: "BanglaDoc LangGraph RAG",
    description: "Retrieval-Augmented Generation system for Bangla PDFs integrating Tesseract OCR with LangGraph. Extracts clean Bangla text from non-Unicode PDFs and provides interactive bilingual Q&A through a Streamlit frontend and OpenAI LLM backend.",
    tech: ["LangGraph", "Tesseract OCR", "Streamlit", "OpenAI", "RAG"],
    image: "",
    github: "",
    demo: ""
  },
  {
    id: "proj5",
    name: "Cattle Weight Estimation System",
    description: "Computer vision-based system to estimate cattle weight from side-view images using YOLO and regression modeling. Improved agricultural accuracy and automation by reducing manual measurement dependency.",
    tech: ["YOLO", "PyTorch", "OpenCV", "Regression"],
    image: "",
    github: "",
    demo: ""
  },
  {
    id: "proj6",
    name: "Biomedical Visual Question Answering",
    description: "Medical VQA system using ViLT (dandelin/vilt-b32-mlm), fine-tuned on MEDPIX-ClinQA. Predicts accurate medical answers given a clinical image and question, bridging vision and language understanding in clinical contexts.",
    tech: ["ViLT", "Hugging Face", "VQA", "Medical AI"],
    image: "",
    github: "https://github.com/TamalSarker777/multimodal-transformer-tasks/tree/main/vision_question_answering",
    demo: ""
  },
  {
    id: "proj7",
    name: "LLM Fine-Tuning & NLP Projects",
    description: "Fine-tuned multiple transformer models: DeepSeek-R1 for instruction-following chat, ALBERT for MLM, Helsinki-NLP for English→French translation, T5 for abstractive summarization. Evaluated using BLEU, ROUGE, and perplexity metrics.",
    tech: ["Hugging Face", "DeepSeek", "T5", "ALBERT", "LoRA", "Transformers"],
    image: "",
    github: "https://github.com/TamalSarker777/transformer-finetuning-projects",
    demo: ""
  },
  {
    id: "proj8",
    name: "ViT — Image Segmentation & Detection",
    description: "Trained nvidia/mit-b0 for pixel-level human parsing segmentation and applied facebook/detr-resnet-50 for animal detection with bounding box prediction. Also classified plant disease images using google/vit-base-patch16-224.",
    tech: ["Vision Transformer", "DETR", "Segmentation", "Object Detection"],
    image: "",
    github: "",
    demo: ""
  }
];

const DEFAULT_PUBLICATIONS = [
  {
    id: "pub1",
    title: "Balancing Binary Biomedical QA: Parameter-Efficient Instruction Tuning on BioASQ and PubMedQA",
    authors: "Tamal Kumar Sarker, Khandakar Jahidul Islam, Utpaul Sarker",
    venue: "IEEE International Conference on Electrical, Computer & Telecommunication Engineering (ICECTE 2026)",
    year: "2026",
    description: "Proposes a parameter-efficient instruction-tuning framework using LoRA + 4-bit quantization to improve binary biomedical QA performance on BioASQ and PubMedQA while addressing class imbalance bias.",
    link: "",
    status: "Accepted"
  }
];

const DEFAULT_CERTIFICATIONS = [
  {
    id: "cert1",
    title: "Generative AI with Large Language Models",
    issuer: "DeepLearning.AI, Coursera",
    year: "2024",
    link: "https://www.coursera.org/learn/generative-ai-with-llms?action=enroll",
    description: "Comprehensive course covering LLM fundamentals, prompt engineering, and fine-tuning concepts."
  },
  {
    id: "cert2",
    title: "Generative AI for Everyone",
    issuer: "DeepLearning.AI, Coursera",
    year: "2024",
    link: "https://www.coursera.org/learn/generative-ai-for-everyone",
    description: "Course covering generative AI concepts, real-world applications, ethics, and responsible AI practices."
  },
  {
    id: "cert3",
    title: "Introduction to LangGraph",
    issuer: "LangGraph",
    year: "2025",
    link: "https://drive.google.com/file/d/1XDjDmjgatlM9U5m9aOFu2iHgXGYZm26K/view",
    description: "Core concepts of LangGraph, workflow orchestration, multi-agent systems, and practical AI application implementation."
  }
];

const DEFAULT_EDUCATION = [
  {
    id: "edu1",
    degree: "Bachelor of Science (BSc) in Computer Science & Engineering",
    institution: "United International University",
    period: "2018 – 2022",
    location: "Dhaka, Bangladesh",
    cgpa: "3.32 / 4.00",
    website: "https://www.uiu.ac.bd"
  }
];

// Admin password hash (SHA-256 of 'tamal2024')
const ADMIN_PASSWORD_HASH = "6965003dc9b99f1cfd879b026670f4af6d9aebda39926e1dcb9735e9be9d0e8d";

// OpenAI config — API key is stored in Firebase Cloud via DataManager
const AI_CONFIG = {
  get apiKey() { return window.DataManager ? window.DataManager.get('apiKey', '') : ''; },
  set apiKey(val) { if(window.DataManager) window.DataManager.set('apiKey', val); },
  model: "gpt-4o-mini",
  maxTokens: 500
};
