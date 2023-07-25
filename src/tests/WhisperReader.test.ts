// Test that WhisperReader's loadDate function calls out to whisper on the command line

import { WhisperReader } from '../WhisperReader';
import { WhisperDevice, WhisperLanguage, WhisperModel, WhisperOutputFormat, WhisperTask } from '../types';


describe('WhisperReader', () => {
  it('should call whisper with the correct arguments and add metadata', async () => {
    const reader = new WhisperReader({
      model: WhisperModel.Base,
      outputFormat: WhisperOutputFormat.Text,
      device: WhisperDevice.CPU,
      outputDirectory: 'src/tests/tmp/',
    });
    const metadata = { language: "en", author: "Neal Armstrong" }
    const documents = await reader.loadData(
      'src/tests/test_files/whisper-audio-test-sample_Armstrong.mp3',
      metadata
    );
    expect(documents.length).toBe(1);
    expect(documents[0].metadata).toBe(metadata);
    expect(documents[0].text).toContain('That\'s one small step for man');
  });

  it('should support transcriptions in other languages', async () => {
    const reader = new WhisperReader({
      model: WhisperModel.Base,
      device: WhisperDevice.CPU,
      outputFormat: WhisperOutputFormat.Text,
      outputDirectory: 'src/tests/tmp/',
      language: WhisperLanguage.French,
      task: WhisperTask.Translate,
    })

    const documents = await reader.loadData('src/tests/test_files/french-test.mp3');
    expect(documents.length).toBe(1);
    // Honestly this translation is a mess, but it's what the model outputs
    expect(documents[0]).toContain("they attack vigorously")
  })
});