import random
import re


def _option_id(index: int) -> str:
    return chr(ord("a") + index)


def generate_quizzes(chunks: list[dict], max_questions: int = 12) -> list[dict]:
    all_keywords = []
    for chunk in chunks:
        all_keywords.extend(chunk.get("keywords", []))
    unique_keywords = list(dict.fromkeys(all_keywords))
    questions: list[dict] = []

    for chunk in chunks:
        sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", chunk["text"]) if len(s.split()) > 8]
        for keyword in chunk.get("keywords", [])[:3]:
            sentence = next((s for s in sentences if keyword.split()[0].lower() in s.lower()), None)
            if not sentence:
                continue
            distractors = [term for term in unique_keywords if term != keyword][:3]
            while len(distractors) < 3:
                distractors.append(random.choice(["Concept", "Process", "Principle", "System"]))
            option_terms = distractors[:3] + [keyword]
            random.shuffle(option_terms)
            correct_id = _option_id(option_terms.index(keyword))
            question_text = sentence.replace(keyword, "____", 1)
            if question_text == sentence:
                question_text = f"Which term best matches this idea: {sentence}"
            questions.append(
                {
                    "topic": keyword,
                    "question": question_text,
                    "options": [{"id": _option_id(i), "text": term} for i, term in enumerate(option_terms)],
                    "correct_answer": correct_id,
                    "explanation": sentence,
                    "difficulty": "medium" if len(sentence.split()) < 35 else "hard",
                    "chunk_order": chunk["order_index"],
                }
            )
            if len(questions) >= max_questions:
                return questions

    # Fallback: if no questions are generated, create a simple quiz from the first chunk.
    if not questions and chunks:
        chunk = chunks[0]
        sentence = chunk["text"].strip()
        if sentence:
            first_word = sentence.split()[0]
            options = [first_word, "Concept", "Principle", "Outcome"]
            random.shuffle(options)
            correct_id = _option_id(options.index(first_word))
            questions.append(
                {
                    "topic": "Key Idea",
                    "question": f"What is the main topic of this passage?",
                    "options": [{"id": _option_id(i), "text": term} for i, term in enumerate(options)],
                    "correct_answer": correct_id,
                    "explanation": sentence,
                    "difficulty": "easy",
                    "chunk_order": chunk["order_index"],
                }
            )
    return questions
