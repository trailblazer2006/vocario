import 'react-simple-keyboard/build/css/index.css';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Keyboard from 'react-simple-keyboard';

import { modelHelper, Word } from '../models';
import { Answer } from '../types';
import { getFullInput, isLetter, isValidAnswer, unusedChars } from '../utils';
import AnswerResult from './AnswerResult';
import Button from './Button';
import If from './If';
import MobileKeyboard from './MobileKeyboard';
import WordInput from './WordInput';

interface QuestionNormalProps {
  text: string;
  input: string;
  keyboardRef: (r: Keyboard) => void;
  onChange: (value: string) => void;
  onValidate: () => void;
}

const QuestionNormal: React.FC<QuestionNormalProps> = ({ text, input, keyboardRef, onChange, onValidate }) => {
  const [highlight, setHighlight] = useState<string>();
  const fullInput = useMemo(() => getFullInput(input, text), [input, text]);
  const buttons = useMemo(() => ['{backspace}', ...unusedChars(input, text)], [input, text]);

  const handleInput = useCallback(
    (value: string) => {
      onChange(value);
      setHighlight(undefined);
    },
    [onChange],
  );
  const handleHelpRequested = useCallback(() => {
    let i = fullInput.length;
    while (i < text.length) {
      const char = text.charAt(i);
      if (isLetter(char)) {
        setHighlight(char);
        break;
      }
      i += 1;
    }
  }, [text, fullInput]);

  return (
    <>
      <div className="ion-text-center">
        <Button color="success" shape="round" onClick={handleHelpRequested}>
          ?
        </Button>
      </div>
      <div className="keyboard-wrapper">
        <MobileKeyboard keyboardRef={keyboardRef} buttons={buttons} highlight={highlight} onChange={handleInput} />
      </div>
      <div className="ion-padding ion-text-center">
        <Button onClick={onValidate} disabled={text.length > fullInput.length}>
          Validate
        </Button>
      </div>
    </>
  );
};

interface WordCardNormalProps {
  word: Word;
  onNext: (valid: boolean) => void;
}

const WordCardNormal: React.FC<WordCardNormalProps> = ({ word, onNext }) => {
  const { translation: title, category } = word;
  const text = useMemo(() => modelHelper.getText(word), [word]);
  const textWithLang = useMemo(() => modelHelper.getTextWithLang(word), [word]);
  const transcription = useMemo(() => modelHelper.getTranscription(word), [word]);
  const [keyboardRef, setKeyboardRef] = useState<Keyboard>();
  const [input, setInput] = useState<string>('');
  const [answer, setAnswer] = useState<Answer>(Answer.empty);
  useEffect(() => {
    setInput('');
    setAnswer(Answer.empty);
    if (keyboardRef) {
      keyboardRef.clearInput();
    }
  }, [word, keyboardRef]);
  const handleValidate = useCallback(() => setAnswer(isValidAnswer(text, getFullInput(input, text))), [input, text]);
  const handleNext = useCallback(() => onNext(answer === Answer.valid), [onNext, answer]);

  return (
    <section>
      <div className="ion-text-center">
        <h1 className="large-text">{title}</h1>
      </div>
      <div>
        <div className="no-padding">
          <WordInput input={input} text={text} />
        </div>
        <If
          condition={answer === Answer.empty}
          then={<QuestionNormal text={text} input={input} keyboardRef={setKeyboardRef} onChange={setInput} onValidate={handleValidate} />}
          else={<AnswerResult text={textWithLang} smallText={transcription} valid={answer === Answer.valid} onNext={handleNext} />}
        />
        <div className="ion-padding small-text">{category}</div>
      </div>
    </section>
  );
};

export default WordCardNormal;
