# https://kaikki.org/dictionary/Ancient%20Greek/words/kaikki.org-dictionary-AncientGreek-words.json

import json
from collections import defaultdict

# WORD = "ἀγαπάω"
WORD = "εἰμί"

for line in open("kaikki.org-dictionary-AncientGreek-words.json"):
    if WORD not in line:
        continue
    j = json.loads(line)
    if not j["senses"][0]["id"].startswith(WORD + "-"):
        continue

    romanization = next(f["form"] for f in j["forms"] if f["tags"] == ["romanization"])

    conjugations = [template["args"]["1"] for template in j["inflection_templates"]]
    conjugation_index = 0

    word_types = defaultdict(dict)

    partOfSpeech = "verb"
    tense = "?"
    voice = "?"
    mood = "?"

    currently_skipping_uncontracted = False

    for form in j["forms"]:
        if form["tags"] == ["table-tags"]:
            continue
        if form["form"] == "grc-conj":
            if currently_skipping_uncontracted:
                currently_skipping_uncontracted = False
                continue
            conj = conjugations[conjugation_index]
            conjugation_index += 1
            tense = {
                "pres": "present",
                "imperf": "imperfect",
                "fut": "future",
                "aor": "aorist",
                "perf": "perfect",
                "plup": "pluperfect",
            }[conj.split("-")[0]]
            if "-con-" in conj:
                currently_skipping_uncontracted = True
            continue
        if "source" not in form or form["source"] != "inflection":
            continue
        if currently_skipping_uncontracted:
            continue

        tags = set(form["tags"])
        voices = {"active": "active", "middle": "middle", "passive": "passive"}
        for voicetag, voicename in voices.items():
            if voicetag in tags:
                voice = voicename
                break
        else:
            voice = "?"

        persons = {
            "first-person": "1st",
            "second-person": "2nd",
            "third-person": "3rd",
        }
        for persontag, personname in persons.items():
            if persontag in tags:
                person = personname
                break
        else:
            person = "?"

        moods = {
            "indicative": "indicative",
            "imperative": "imperative",
            "optative": "optative",
            "subjunctive": "subjunctive",
        }
        for moodtag, moodname in moods.items():
            if moodtag in tags:
                mood = moodname
                break
        else:
            mood = "?"

        numbers = {
            "singular": "singular",
            "dual": "dual",
            "plural": "plural",
        }
        for numbertag, numbername in numbers.items():
            if numbertag in tags:
                number = numbername
                break
        else:
            number = "?"

        if number == "dual":
            continue

        word_types[(partOfSpeech, voice, tense, mood)][f"{number}_{person}"] = form[
            "form"
        ]

    for (partOfSpeech, voice, tense, mood), inflections in word_types.items():
        print(
            json.dumps(
                {
                    "partOfSpeech": partOfSpeech,
                    "voice": voice,
                    "tense": tense,
                    "mood": mood,
                    "words": [inflections],
                },
                indent=2,
                ensure_ascii=False,
            )
        )
