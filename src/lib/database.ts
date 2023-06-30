import { get, set } from "idb-keyval";

export const DEFAULT_SKILL = 10;

export async function getInflectionSkill(
    wordType: string,
    inflection: string
): Promise<number> {
    const result = await get<number>(`skill.${wordType}.${inflection}`);
    if (result === undefined) {
        return DEFAULT_SKILL;
    }
    return result;
}

export async function updateSkill(
    wordType: string,
    inflection: string,
    correct: boolean
) {
    const originalSkill = await getInflectionSkill(wordType, inflection);
    const delta = correct ? 1 : -1;
    let newSkill = originalSkill + delta;
    if (newSkill < 0) newSkill = 0;
    await set(`skill.${wordType}.${inflection}`, newSkill);
}
