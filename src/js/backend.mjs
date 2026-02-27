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