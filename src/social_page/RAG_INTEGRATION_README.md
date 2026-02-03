# RAG Chatbot Integration - Social Studies Assistant

## Overview
This document describes the integration of a RAG (Retrieval-Augmented Generation) chatbot into the Social Studies Educational Page. The chatbot provides intelligent assistance for all chapters and subjects.

## Features Implemented

### 1. **Automatic PDF Loading**
- The social studies PDF is automatically loaded when the assistant section is accessed
- No user interaction required - completely invisible to users
- PDF processing happens in the background

### 2. **Chapter-Aware Responses**
- The chatbot understands which chapter/subject is currently selected
- Responses are prioritized based on the current chapter context
- Chapter context is passed as "Subject - Chapter Name" format (e.g., "History - Ancient India")

### 3. **Seamless Integration**
- RAG chatbot appears only in the "Assistant" tab
- Maintains the same orange/blue theme as the main application
- Responsive design that works on all screen sizes

### 4. **Error Handling & Retry**
- Loading states with "Loading learning assistant..." message
- Error messages with retry functionality
- Graceful fallback if PDF loading fails

### 5. **Styling & UX**
- Orange/blue gradient theme matching the main app
- Smooth animations and transitions
- Clean, educational interface design
- No upload functionality (PDF is pre-loaded)

## Technical Implementation

### Files Added/Modified:
- `src/components/PDFChatRAG.tsx` - Main RAG chatbot component
- `src/utils/geminiApi.ts` - Gemini API integration
- `src/utils/pdfUtils.ts` - PDF processing utilities
- `src/config/api.ts` - API key configuration
- `src/App.tsx` - Integration with main application
- `src/index.css` - Additional styling for RAG components

### Dependencies Added:
- `framer-motion` - For animations
- `lunr` - For text search indexing
- `pdfjs-dist` - For PDF text extraction

### API Configuration:
- Uses Google Gemini API for text generation
- API key can be configured in `src/config/api.ts`
- Default API key provided for testing

## Usage

1. **Navigate to any chapter** in the sidebar
2. **Click on the "Assistant" tab**
3. **Wait for PDF loading** (happens automatically)
4. **Ask questions** about the current chapter
5. **Get intelligent responses** based on the PDF content

## Chapter Context Mapping

The chatbot automatically detects the current chapter and provides context-aware responses:

- **History**: Ancient India, India from 9th to 14th CE, Mughal Emperors, Modern India, Telangana History
- **Geography**: Our Universe, All About Villages, Physical Divisions Of India, Natural Resources
- **Political Science**: Indian Constitution, Union and State Government
- **Economics**: Economic System

## Error Handling

- **PDF Loading Errors**: Shows retry button with error message
- **API Errors**: Displays user-friendly error messages
- **Network Issues**: Handles connectivity problems gracefully

## Future Enhancements

- Add more PDF files for different subjects
- Implement conversation history persistence
- Add voice input/output capabilities
- Enhance search algorithms for better context retrieval

## Notes

- The PDF file is loaded from the public directory
- All assistant sections use the same RAG component
- Chapter context is dynamically updated based on sidebar selection
- No user training or setup required
