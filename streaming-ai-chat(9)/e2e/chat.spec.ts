import { test, expect } from '@playwright/test';

test.describe('FE-09 Streaming AI Chat Primary Flow', () => {
  test('open application → enter message → submit → assistant response appears', async ({
    page,
  }) => {
    // Intercept /api/chat to provide a deterministic streamed assistant response
    await page.route('**/api/chat', async (route) => {
      const responseStream =
        '0:"Hello! "\n0:"I am your AI assistant running in deterministic test mode."\n';

      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        headers: {
          'x-vercel-ai-data-stream': 'v1',
        },
        body: responseStream,
      });
    });

    // 1. Open the application and wait for client-side hydration
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify main header is visible
    await expect(page.getByRole('heading', { name: /FE-09 Streaming AI Chat/i })).toBeVisible();

    // 2. Enter a prompt message in the chat input
    const promptInput = page.getByLabel(/Chat prompt message/i);
    await expect(promptInput).toBeVisible();
    await promptInput.pressSequentially('Hello from Playwright E2E test!', { delay: 20 });

    // 3. Submit the message via the Send button
    const sendButton = page.getByRole('button', { name: /Send message/i });
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    // 4. Verify user message appears in the chat stream
    await expect(page.getByText('Hello from Playwright E2E test!')).toBeVisible();

    // 5. Verify assistant response appears
    await expect(
      page.getByText('Hello! I am your AI assistant running in deterministic test mode.')
    ).toBeVisible();
  });
});
