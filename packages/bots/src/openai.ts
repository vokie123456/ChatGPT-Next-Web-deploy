import { AbstractBot } from './abstract-bot';
import { AnswerParams, GPTModel } from './types';
import { streamToLineIterator } from './utils';
import * as process from 'process';

const API_END_POINT = process.env.OPENAI_PROXY ?? 'https://api.openai.com';
const COMPLETIONS_URL = `${API_END_POINT}/v1/chat/completions`;

export class OpenAIBot extends AbstractBot {
  constructor(
    private readonly apiKey: string = "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",
    private readonly model: GPTModel = 'gpt-3.5-turbo'
  ) {
    super();
  }

  protected async *doAnswer(params: AnswerParams): AsyncIterable<string> {
    const { conversation, maxTokens, signal } = params;

    const response = await fetch(COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: conversation,
        max_tokens: maxTokens,
        stream: true,
      }),
      signal,
    });
    console.debug(`fetch is: ${JSON.stringify(await fetch(COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: conversation,
        max_tokens: maxTokens,
        stream: true,
      }),
      signal,
    }))}`);
    console.debug(`Bearer ${this.apiKey}`);
    console.debug(`body is: ${JSON.stringify({
      model: this.model,
      messages: conversation,
      max_tokens: maxTokens,
      stream: true,
    })}`);
    console.debug(`signal is: ${JSON.stringify(signal)}`);

    if (!response.ok) {
      throw new Error(`OpenAI API error1: ${response.statusText}`);
    }

    const lines = streamToLineIterator(response.body!);

    for await (const line of lines) {
      if (!line.startsWith('data:')) continue;

      const data = line.slice('data:'.length).trim();

      if (!data || data === '[DONE]') continue;

      const {
        choices: [
          {
            delta: { content },
          },
        ],
      } = JSON.parse(data);

      if (!content) continue;
      yield content;
    }
  }
}
