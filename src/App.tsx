/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Send, RotateCcw, ChevronRight, ChevronLeft, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  type: 'fill' | 'choice' | 'error';
  text: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
}

const QUESTIONS: Question[] = [
  // Part A: Fill in the blanks
  { id: 1, type: 'fill', text: 'In the world, there (be) __________ only 14 mountains that (reach) __________ above 8,000 meters.', answer: ['are', 'reach'] },
  { id: 2, type: 'fill', text: 'He sometimes (come) __________ to see his parents.', answer: 'comes' },
  { id: 3, type: 'fill', text: 'When I (come) __________, she (leave) __________ for Da Lat ten minutes ago.', answer: ['came', 'had left'] },
  { id: 4, type: 'fill', text: 'My grandfather never (fly) __________ in an airplane, and he has no intention of ever doing so.', answer: 'has never flown' },
  { id: 5, type: 'fill', text: 'We just (decide) __________ that we (undertake) __________ the job.', answer: ['have just decided', 'will undertake'] },
  { id: 6, type: 'fill', text: 'Right now I (attend) __________ class. Yesterday at this time I (attend) __________ class.', answer: ['am attending', 'was attending'] },
  { id: 7, type: 'fill', text: 'Tomorrow I’m going to leave for home. When I (arrive) __________ at the airport, Mary (wait) __________ for me.', answer: ['arrive', 'will be waiting'] },
  { id: 8, type: 'fill', text: 'The traffic was very heavy. By the time I (get) __________ to Mary’s party, everyone already (arrive) ________Ref.', answer: ['got', 'had already arrived'] },
  { id: 9, type: 'fill', text: 'You (be) __________ here before? - Yes, I (spend) __________ my holidays here last year.', answer: ['Have you been', 'spent'] },
  { id: 10, type: 'fill', text: 'While we (talk) __________ on the phone, the children (start) __________ fighting and (break) __________ a window.', answer: ['were talking', 'started', 'broke'] },

  // Part B: Multiple choice
  { id: 11, type: 'choice', text: 'We _______ Dorothy since last Saturday.', options: ['don’t see', 'haven’t seen', 'didn’t see', 'had hadn’t seen'], answer: 'B' },
  { id: 12, type: 'choice', text: 'The train ______ half an hour ago.', options: ['has been leaving', 'left', 'has left', 'had left'], answer: 'B' },
  { id: 13, type: 'choice', text: 'Jack ______ the door.', options: ['has just painted', 'paint', 'will have painted', 'painting'], answer: 'A' },
  { id: 14, type: 'choice', text: 'I ______ Texas State University now.', options: ['am attending', 'attend', 'was attending', 'attended'], answer: 'A' },
  { id: 15, type: 'choice', text: 'He has been selling motorbikes ________.', options: ['ten years ago', 'since ten years', 'for ten years ago', 'for ten years'], answer: 'D' },
  { id: 16, type: 'choice', text: 'Christopher Columbus _______ America more than 500 years ago.', options: ['discovered', 'has discovered', 'had discovered', 'had been discovering'], answer: 'A' },
  { id: 17, type: 'choice', text: 'He fell down when he ______ towards the church.', options: ['run', 'runs', 'was running', 'had run'], answer: 'C' },
  { id: 18, type: 'choice', text: 'They ______ table tennis when their father comes back home.', options: ['will play', 'will be playing', 'play', 'would play'], answer: 'B' },
  { id: 19, type: 'choice', text: 'By the age of 25, he ______ two famous novels.', options: ['wrote', 'writes', 'has written', 'had written'], answer: 'D' },
  { id: 20, type: 'choice', text: 'Turn off the gas. Don’t you see the kettle ________ ?', options: ['boil', 'boils', 'is boiling', 'boiled'], answer: 'C' },

  // Part C: Error identification
  { id: 21, type: 'error', text: 'Linda has worn her new yellow dress only once since she buys (D) it.', options: ['A', 'B', 'C', 'D'], answer: 'D' },
  { id: 22, type: 'error', text: 'Last week Mark told me that he got very bored with his present job and is looking (D) for a new one.', options: ['A', 'B', 'C', 'D'], answer: 'D' },
  { id: 23, type: 'error', text: 'When I turned on my computer, I was shocked to find some junk mail, and I just delete (D) it all.', options: ['A', 'B', 'C', 'D'], answer: 'D' },
  { id: 24, type: 'error', text: 'They are going to have to leave soon and so do (D) we.', options: ['A', 'B', 'C', 'D'], answer: 'D' },
  { id: 25, type: 'error', text: 'The boss laughed when the secretary has told (B) him that she really needed a pay rise.', options: ['A', 'B', 'C', 'D'], answer: 'B' },
  { id: 26, type: 'error', text: 'The telephone rang several times and then stop (B) before I could answer it.', options: ['A', 'B', 'C', 'D'], answer: 'B' },
  { id: 27, type: 'error', text: 'Debbie, whose father is an excellent tennis player, has been playing tennis since (D) ten years.', options: ['A', 'B', 'C', 'D'], answer: 'D' },
  { id: 28, type: 'error', text: 'I have seen (A) lots of interesting places when I went on holiday last summer.', options: ['A', 'B', 'C', 'D'], answer: 'A' },
  { id: 29, type: 'error', text: 'When my cat heard a noise in the bushes, she stopped moving and listen (D) intently.', options: ['A', 'B', 'C', 'D'], answer: 'D' },
  { id: 30, type: 'error', text: 'When I’m shopping (A) in the supermarket, I ran into an old friend who I hadn’t met for five years.', options: ['A', 'B', 'C', 'D'], answer: 'A' },
];

export default function App() {
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentPart, setCurrentPart] = useState<'A' | 'B' | 'C'>('A');

  const handleFillChange = (id: number, index: number, value: string) => {
    const current = (answers[id] as string[]) || [];
    const updated = [...current];
    updated[index] = value;
    setAnswers({ ...answers, [id]: updated });
  };

  const handleChoiceChange = (id: number, value: string) => {
    setAnswers({ ...answers, [id]: value });
  };

  const checkAnswer = (q: Question) => {
    const userAns = answers[q.id];
    if (!userAns) return false;

    if (q.type === 'fill') {
      const expected = Array.isArray(q.answer) ? q.answer : [q.answer];
      const actual = Array.isArray(userAns) ? userAns : [userAns];
      
      return expected.every((val, idx) => 
        val.toLowerCase().trim() === (actual[idx] || '').toLowerCase().trim()
      );
    }

    return userAns === q.answer;
  };

  const calculateScore = () => {
    const correctCount = QUESTIONS.filter(q => checkAnswer(q)).length;
    return (10 * correctCount) / QUESTIONS.length;
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setCurrentPart('A');
  };

  const partQuestions = QUESTIONS.filter(q => {
    if (currentPart === 'A') return q.id <= 10;
    if (currentPart === 'B') return q.id > 10 && q.id <= 20;
    return q.id > 20;
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif italic mb-4"
          >
            English Grammar Practice
          </motion.h1>
          <p className="text-stone-500 uppercase tracking-widest text-xs font-medium">
            Tenses & Error Identification
          </p>
        </header>

        <div className="flex justify-center gap-4 mb-8">
          {(['A', 'B', 'C'] as const).map((part) => (
            <button
              key={part}
              onClick={() => setCurrentPart(part)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                currentPart === part 
                ? 'bg-stone-900 text-white' 
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
              }`}
            >
              Phần {part}
            </button>
          ))}
        </div>

        <motion.div 
          key={currentPart}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {partQuestions.map((q, idx) => (
            <div 
              key={q.id} 
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-stone-300 text-lg">{(currentPart === 'A' ? 0 : currentPart === 'B' ? 10 : 20) + idx + 1}</span>
                <div className="flex-1">
                  <p className="text-lg leading-relaxed mb-4">{q.text}</p>
                  
                  {q.type === 'fill' && (
                    <div className="flex flex-wrap gap-4">
                      {(Array.isArray(q.answer) ? q.answer : [q.answer]).map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          disabled={submitted}
                          placeholder={`Answer ${i + 1}`}
                          className="border-b-2 border-stone-200 focus:border-stone-900 outline-none px-2 py-1 bg-transparent transition-colors w-full md:w-48"
                          value={((answers[q.id] as string[]) || [])[i] || ''}
                          onChange={(e) => handleFillChange(q.id, i, e.target.value)}
                        />
                      ))}
                    </div>
                  )}

                  {(q.type === 'choice' || q.type === 'error') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options?.map((opt, i) => {
                        const label = String.fromCharCode(65 + i);
                        return (
                          <button
                            key={label}
                            disabled={submitted}
                            onClick={() => handleChoiceChange(q.id, label)}
                            className={`text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                              answers[q.id] === label
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-stone-50 border-stone-100 hover:border-stone-300'
                            }`}
                          >
                            <span className="font-mono opacity-50">{label}.</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {submitted && (
                  <div className="flex-shrink-0">
                    {checkAnswer(q) ? (
                      <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                    ) : (
                      <XCircle className="text-rose-500 w-6 h-6" />
                    )}
                  </div>
                )}
              </div>
              
              {submitted && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className={`mt-4 pt-4 border-t text-sm font-medium ${checkAnswer(q) ? 'text-emerald-700' : 'text-rose-700'}`}
                >
                  {checkAnswer(q) ? 'Đúng' : 'Sai'}
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>

        <footer className="mt-12 flex flex-col items-center gap-6 pb-20">
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              className="group flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform shadow-lg"
            >
              <Send className="w-4 h-4" />
              Nộp bài
            </button>
          ) : (
            <div className="text-center space-y-6 w-full">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-stone-900 text-white p-8 rounded-3xl shadow-2xl inline-block"
              >
                <Award className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                <h2 className="text-xl font-medium mb-1">Kết quả của bạn</h2>
                <div className="text-6xl font-serif italic mb-2">
                  {calculateScore().toFixed(1)}
                </div>
                <p className="text-stone-400 text-sm uppercase tracking-widest">Thang điểm 10</p>
              </motion.div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-2 bg-white border border-stone-200 px-6 py-3 rounded-full font-medium hover:border-stone-400 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Làm lại
                </button>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
