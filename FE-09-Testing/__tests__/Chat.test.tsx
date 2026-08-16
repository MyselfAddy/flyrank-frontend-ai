import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Chat from '@/components/Chat';
import { useChat } from '@ai-sdk/react';

// Mock @ai-sdk/react
vi.mock('@ai-sdk/react', () => ({
  useChat: vi.fn(),
}));

describe('Chat Component', () => {
  const mockHandleInputChange = vi.fn();
  const mockHandleSubmit = vi.fn();
  const mockStop = vi.fn();
  const mockReload = vi.fn();
  const mockSetMessages = vi.fn();
  const mockSetInput = vi.fn();
  const mockAppend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. renders user message with role and text content', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello, what is the speed of light?',
        },
      ],
      input: '',
      setInput: mockSetInput,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      stop: mockStop,
      reload: mockReload,
      error: undefined,
      setMessages: mockSetMessages,
      append: mockAppend,
      data: undefined,
      setData: vi.fn(),
      status: 'ready',
    } as unknown as ReturnType<typeof useChat>);

    render(<Chat />);

    // User label and message content should be visible
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Hello, what is the speed of light?')).toBeInTheDocument();
  });

  it('2. renders assistant message with role and response content', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Tell me about light.',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Light travels at approximately 299,792 kilometers per second in a vacuum.',
        },
      ],
      input: '',
      setInput: mockSetInput,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      stop: mockStop,
      reload: mockReload,
      error: undefined,
      setMessages: mockSetMessages,
      append: mockAppend,
      data: undefined,
      setData: vi.fn(),
      status: 'ready',
    } as unknown as ReturnType<typeof useChat>);

    render(<Chat />);

    expect(screen.getByText('Gemini AI Assistant')).toBeInTheDocument();
    expect(
      screen.getByText('Light travels at approximately 299,792 kilometers per second in a vacuum.')
    ).toBeInTheDocument();
  });

  it('3. renders pending/thinking state when waiting for the first token', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Analyze this complex topic',
        },
      ],
      input: '',
      setInput: mockSetInput,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: true,
      stop: mockStop,
      reload: mockReload,
      error: undefined,
      setMessages: mockSetMessages,
      append: mockAppend,
      data: undefined,
      setData: vi.fn(),
      status: 'submitted',
    } as unknown as ReturnType<typeof useChat>);

    render(<Chat />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/Thinking\.\.\. preparing stream/i)).toBeInTheDocument();
  });

  it('4. renders streaming state with active Stop button', async () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Count to 100',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: '1, 2, 3, 4, 5...',
        },
      ],
      input: '',
      setInput: mockSetInput,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: true,
      stop: mockStop,
      reload: mockReload,
      error: undefined,
      setMessages: mockSetMessages,
      append: mockAppend,
      data: undefined,
      setData: vi.fn(),
      status: 'streaming',
    } as unknown as ReturnType<typeof useChat>);

    render(<Chat />);

    expect(screen.getByText('1, 2, 3, 4, 5...')).toBeInTheDocument();
    const stopButton = screen.getByRole('button', { name: /Stop generating response/i });
    expect(stopButton).toBeInTheDocument();

    await userEvent.click(stopButton);
    expect(mockStop).toHaveBeenCalledTimes(1);
  });

  it('5. renders error state banner with recovery actions on API failure', () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello',
        },
      ],
      input: '',
      setInput: mockSetInput,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      stop: mockStop,
      reload: mockReload,
      error: new Error('Failed to fetch chat stream'),
      setMessages: mockSetMessages,
      append: mockAppend,
      data: undefined,
      setData: vi.fn(),
      status: 'error',
    } as unknown as ReturnType<typeof useChat>);

    render(<Chat />);

    const alertBanner = screen.getByRole('alert');
    expect(alertBanner).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry response generation/i })).toBeInTheDocument();
  });

  it('6. executes retry interaction when retry button is clicked', async () => {
    mockReload.mockResolvedValue('reloaded response');

    vi.mocked(useChat).mockReturnValue({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello',
        },
      ],
      input: '',
      setInput: mockSetInput,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      stop: mockStop,
      reload: mockReload,
      error: new Error('Rate limit 429 quota exceeded'),
      setMessages: mockSetMessages,
      append: mockAppend,
      data: undefined,
      setData: vi.fn(),
      status: 'error',
    } as unknown as ReturnType<typeof useChat>);

    render(<Chat />);

    // Check rate-limit specific text
    expect(screen.getByText(/Service temporarily busy/i)).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /Retry response generation/i });
    await userEvent.click(retryButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('7. validates chat input and prevents submitting empty or whitespace-only prompts', async () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [],
      input: '   ',
      setInput: mockSetInput,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      stop: mockStop,
      reload: mockReload,
      error: undefined,
      setMessages: mockSetMessages,
      append: mockAppend,
      data: undefined,
      setData: vi.fn(),
      status: 'ready',
    } as unknown as ReturnType<typeof useChat>);

    render(<Chat />);

    const textarea = screen.getByLabelText(/Chat prompt message/i);
    expect(textarea).toBeInTheDocument();

    // Trigger Enter key on empty/whitespace input
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Warning alert should appear and handleSubmit should not be called
    expect(screen.getByRole('alert')).toHaveTextContent(/Please enter a message before sending/i);
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });

  it('8. handles mid-stream failure notice while preserving partial assistant message', async () => {
    mockReload.mockResolvedValue('reloaded response');

    vi.mocked(useChat).mockReturnValue({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Tell me a long story',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Once upon a time in a digital realm...',
        },
      ],
      input: '',
      setInput: mockSetInput,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      stop: mockStop,
      reload: mockReload,
      error: new Error('Network stream interrupted midway'),
      setMessages: mockSetMessages,
      append: mockAppend,
      data: undefined,
      setData: vi.fn(),
      status: 'error',
    } as unknown as ReturnType<typeof useChat>);

    render(<Chat />);

    // Partial response is preserved
    expect(screen.getByText('Once upon a time in a digital realm...')).toBeInTheDocument();

    // Stream interrupted alert is displayed
    const midStreamAlert = screen.getByRole('alert');
    expect(midStreamAlert).toHaveTextContent(/Stream interrupted/i);

    const inlineRetryButton = screen.getByRole('button', {
      name: /Retry generating interrupted response/i,
    });
    await userEvent.click(inlineRetryButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('9. allows clearing the chat conversation', async () => {
    vi.mocked(useChat).mockReturnValue({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Old message',
        },
      ],
      input: '',
      setInput: mockSetInput,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      stop: mockStop,
      reload: mockReload,
      error: undefined,
      setMessages: mockSetMessages,
      append: mockAppend,
      data: undefined,
      setData: vi.fn(),
      status: 'ready',
    } as unknown as ReturnType<typeof useChat>);

    render(<Chat />);

    const clearButton = screen.getByRole('button', { name: /Clear chat conversation/i });
    await userEvent.click(clearButton);

    expect(mockSetMessages).toHaveBeenCalledWith([]);
  });
});
