// Mock OpenAI API responses for testing
export const mockVisionResponse = {
  choices: [
    {
      message: {
        content: JSON.stringify({
          type: 'expense',
          amount: 45.50,
          currency: 'BRL',
          date: '2025-10-29T10:30:00Z',
          merchant: 'Padaria Central',
          method: 'credit_card',
          category: 'food',
          notes: 'Coffee and pastries',
          confidence: 0.92,
          language: 'pt-BR',
        }),
      },
    },
  ],
};

export const mockWhisperResponse = {
  text: 'Gastei quarenta e cinco reais com cinquenta centavos na Padaria Central hoje de manhã',
};

export const mockGPTExtractionResponse = {
  choices: [
    {
      message: {
        content: JSON.stringify({
          type: 'expense',
          amount: 150.00,
          currency: 'USD',
          date: '2025-10-29T14:00:00Z',
          merchant: 'Amazon',
          method: 'credit_card',
          category: 'shopping',
          notes: 'Books purchase',
          confidence: 0.88,
          language: 'en',
        }),
      },
    },
  ],
};

export const mockReceiptImageUrl = 'https://example.com/receipt.jpg';
export const mockAudioUrl = 'https://example.com/voice-note.mp3';
export const mockTextInput = 'I spent $150 on books at Amazon today';
