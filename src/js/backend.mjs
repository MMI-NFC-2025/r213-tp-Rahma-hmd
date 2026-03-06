import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

export async function getOffres() {
    try {
        let data = await pb.collection('Maison').getFullList({
            sort: '-created',
        });
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la liste des maisons', error);
        return [];
    }
}

export async function oneID(id) {
    const record = await pb.collection('Maison').getOne(id);
    return record;
}
export async function getImageUrl(record, recordImage) {
    return pb.files.getUrl(record, recordImage);
}
export async function allMaisonsFavori() {
    const records = await pb.collection('Maison').getFullList({ filter: 'favoris = true' });
    return records;
}

export async function allMaisonsSorted() {
    const record = await pb.collection('Maison').getFullList({ sort: 'Prix' });
    return record;
}

export async function bySurface(s) {
    const record = await pb.collection('Maison').getFullList({ filter: `superficie > ${s}` });
    return record;
}

export async function filterByPrix(minPrix, maxPrix) {
    try {
        const records = await pb.collection('Maison').getFullList({ sort: '-created' });
        return records.filter((record) => {
            const prixValue = Number(record.prix ?? record.Prix);
            return Number.isFinite(prixValue) && prixValue >= minPrix && prixValue <= maxPrix;
        });
    } catch (error) {
        console.log('Une erreur est survenue en filtrant les maisons par prix', error);
        return [];
    }
}

export async function surfaceORprice(s, p) {
    const record = await pb.collection('Maison').getFullList({ filter: `superficie  ${s} || Prix < ${p}` });
    return record;
}

export async function oneAgent(id) {
    const record = await pb.collection('Agent').getOne(id);
    return record;
}

export async function getAgents() {
    try {
        const records = await pb.collection('Agent').getFullList({
            sort: '-created',
        });
        return records;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la liste des agents', error);
        return [];
    }
}

export async function getOffresByAgentId(agentId) {
    const relationFields = [
        'agent',
        'Agent',
        'agentId',
        'agent_id',
        'id_agent',
        'conseiller',
        'vendeur',
    ];

    const offersById = new Map();

    for (const field of relationFields) {
        try {
            const records = await pb.collection('Maison').getFullList({
                sort: '-created',
                filter: `${field} = "${agentId}"`,
            });

            for (const record of records) {
                offersById.set(record.id, record);
            }
        } catch (error) {
            // Ignore unknown-field filter errors and try the next field.
        }
    }

    if (offersById.size > 0) {
        return [...offersById.values()];
    }

    // Fallback: if no filter worked, scan all houses and match common relation fields in JS.
    try {
        const allOffres = await pb.collection('Maison').getFullList({
            sort: '-created',
        });

        return allOffres.filter((offre) => {
            const values = [
                offre.agent,
                offre.Agent,
                offre.agentId,
                offre.agent_id,
                offre.id_agent,
                offre.conseiller,
                offre.vendeur,
            ];

            return values.some((value) => {
                if (Array.isArray(value)) {
                    return value.some((item) => String(item) === String(agentId));
                }
                return String(value) === String(agentId);
            });
        });
    } catch (error) {
        console.log("Une erreur est survenue en lisant les offres de l'agent", error);
        return [];
    }
}