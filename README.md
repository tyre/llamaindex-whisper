# LlamaIndex integration with OpenAI's whisper

## Installation

This integrates the [LlamaIndexTS project](https://github.com/run-llama/LlamaIndexTS/) with OpenAI's [whisper](https://github.com/openai/whisper) speech transcription and translation library.

### Required libraries

To start, ensure you have whisper locally:
```bash
pip install whisper
```

And this package, of course:

```bash
npm install llamaindex-whisper
```

## Getting started

Simply import the `WhisperReader` and load your data. It's that easy!

`loadData` returns an array of LlamaIndex Document objects. The array always contains one Document with all of the text. (Support for chunking and splitting is a future concern.)

```typescript
  import { WhisperReader } from "llamaindex-whisper";
  const reader = new WhisperReader();
  const documents = reader.loadData("this-is-water-speech.mp3");
  // => Document(text="Greetings parents and congratulations to Kenyon’s graduating class of 2005…")
```

Combining that with llamaindex itself:

```typescript
import { VectorStoreIndex } from "llamaindex";
import { WhisperReader, WhisperDevice, WhisperOutputFormat } from "llamaindex-whisper";

async function main() {
  const whisperReader = new WhisperReader({
    device: WhisperDevice.CPU,
    outputFormat: WhisperOutputFormat.Text,
  });

  const documents = await whisperReader.loadData("./giant-leap.mp3")

  // Split text and create embeddings. Store them in a VectorStoreIndex
  const index = await VectorStoreIndex.fromDocuments(documents);

  // Query the index
  const queryEngine = index.asQueryEngine();
  const response = await queryEngine.query(
    "How big were the step and the leap?"
  );

  // Output response
  console.log(response.toString());
  // => Based on the given context information, the step and the leap are not described in terms of their size or magnitude.
  // Well, you can't win them all…
}

main();
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

### Model

`WhisperModel` could be any of the supported whisper models and defaults to `Base`. `English` variants are specifically fine-tuned for english processing. The generic models are multilingual:

```typescript
TinyEnglish
Tiny
BaseEnglish
Base
SmallEnglish
Small
MediumEnglish
Medium
LargeV1
LargeV2
Large
```

### Language

`WhisperLanguage` has mappings for nearly 100 languages, from Afrikaans to Yoruba. Specifically:

> Afrikaans, Albanian, Amharic, Arabic, Armenian, Assamese, Azerbaijani, Bashkir, Basque, Belarusian, Bengali, Bosnian, Breton, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Faroese, Finnish, French, Galician, Georgian, German, Greek, Gujarati, HaitianCreole, Hausa, Hawaiian, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Italian, Japanese, Javanese, Kannada, Kazakh, Khmer, Korean, Lao, Latin, Latvian, Lingala, Lithuanian, Luxembourgish, Macedonian, Malagasy, Malay, Malayalam, Maltese, Maori, Marathi, Mongolian, Myanmar, Nepali, Norwegian, Nynorsk, Occitan, Pashto, Persian, Polish, Portuguese, Punjabi, Romanian, Russian, Sanskrit, Serbian, Shona, Sindhi, Sinhala, Slovak, Slovenian, Somali, Spanish, Sundanese, Swahili, Swedish, Tagalog, Tajik, Tamil, Tatar, Telugu, Thai, Tibetan, Turkish, Turkmen, Ukrainian, Urdu, Uzbek, Vietnamese, Welsh, Yiddish, Yoruba


### OutputFormat

`WhisperOutputFormat` tells whisper the format of the file it writes for transcription. The default is `All`, which writes one file for each of the supported types. I don't know why they decided on that—I can't imagine it's what people want—so you'll want to specify an output.

```typescript
All
Text
VTT
SRT
TSV
JSON
```

## Task

`WhisperTask` can be set to either `Transcribe` or `Translate`. Transcription is the default.

## Device

`WhisperDevice` can be either `CPU` or `CUDA`. This defaults to `CUDA`, so take note to swap into CPU mode if your graphics card does not support it.