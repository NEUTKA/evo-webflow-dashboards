# Create exercises with AI

Open **Create with AI** and select an **Exercise type**. All generated content is in English, including instructions, explanations and model answers. You may write your request in any language; requests to change the output language do not override this rule.

| Type | Generated draft | Example request |
| --- | --- | --- |
| Grammar | 5 sentences, each with one gap and 3 choices, correct answers and explanations | Create an A2 exercise comparing Past Simple and Present Perfect about travel. |
| Reading | An original English passage, about 150–250 words adjusted to the level, and 5 comprehension questions with 3 choices each | Create an A2 reading exercise about a first trip to London. Test details and main ideas. |
| Vocabulary | 5 sentences with a word gap, 3 choices each, correct answers and explanations | Create a B1 vocabulary exercise about work, focusing on collocations. |
| Listening | An original spoken monologue and 5 comprehension questions with 3 choices each | Create an A2 listening exercise about a train journey. Test key facts. |
| Writing | 5 open-ended writing prompts with suitable word counts, model answers and assessment criteria for the teacher | Create B1 writing tasks about travel, including emails and short descriptions. |

Describe the topic, CEFR level (A1–C2), audience and context. Question counts and answer-choice counts are automatic. Matching and other exercise formats are outside this generator's current contract.

## Listening playback

Listening uses the browser's English text-to-speech voice; it does not create an MP3 file. Review the script and use **Preview audio** before sending. Students use **Play audio** and **Stop audio**. The student exercise displays the questions without the transcript. An English speech voice must be available on the student's browser/device. If voices have not loaded yet, wait a moment and retry. If playback remains unavailable, try a browser/device with English speech support.

## Writing review

Students enter free-text responses and can save a draft or submit for teacher review. Model answers and assessment criteria are displayed in the teacher's review interface, not the student's exercise. Model answers are examples, not unique correct answers. Writing is reviewed by the teacher; it is not automatically graded against the model answer.

## Review and send

1. Select the type, enter a request and click **Generate draft**.
2. Review and edit every task, answer and explanation. For reading/listening, check that answers are supported by the passage. For writing, check prompts, word counts, model answers and criteria.
3. Select an active linked student and confirm that you reviewed the draft.
4. Click **Send to student**.

Editing content clears the review confirmation. Changing type discards a generated draft after confirmation. Until sent, the draft stays in the current tab. After an uncertain delivery result, use **Retry send**: the draft is locked and the same request is retried without creating duplicate assignments.

## Validation and rollout

From `server-prototype`, install the pinned development dependency with `pnpm install --frozen-lockfile`, then run `pnpm test`. Tests cover all five types through mocked generation, teacher editing/review, student rendering, response collection/progress, listening playback events, and the SQL delivery function in an isolated PostgreSQL engine. They do not call the live AI provider or the production database.

Rollout requires all three components: the new `ai_exercise_all_skills` SQL migration, the updated `generate-teacher-exercise` Edge Function, and both dashboard scripts. Keep the existing migrations unchanged. Confirm the production `assignment_templates` constraints allow the new template types and the `writing` answer mode before applying. Preserve existing RLS policies and grants. Verify each skill with a teacher and linked test student in staging before production rollout.

The configuration marks this as an isolated prototype requiring explicit deployment approval. This change prepares the code and migration; it does not deploy them or change live assignments.
