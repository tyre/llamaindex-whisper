# LlamaIndex integration with OpenAI's whisper

## Installation

This integrates the [LlamaIndexTS project](https://github.com/run-llama/LlamaIndexTS/) with OpenAI's [whisper](https://github.com/openai/whisper) speech transcription and translation library.

### Install whisper
To start, ensure you have whisper locally:
```bash
pip install whisper
```

### import modules

```typescript
  import { WhisperReader } from "llamaindex-whisper";
  const reader = new WhisperReader();
  const documents = reader.loadData("this-is-water-speech.mp3");
  // => Document(text="Greetings parents and congratulations to Kenyon’s graduating class of 2005…")
```

## Options

`WhisperReader` supports a subset of the whisper CLI. Here are the ones supported so far with their defaults:

```typescript
  model: WhisperModel = WhisperModel.Base;
  temperature: number = 0;
  language: WhisperLanguage = WhisperLanguage.English;
  outputDirectory = ".";
  outputFormat = WhisperOutputFormat.All;
  task: WhisperTask = WhisperTask.Transcribe;
  device: WhisperDevice = WhisperDevice.CUDA;
```