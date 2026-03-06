import PocketBase from 'pocketbase';
const pb = new PocketBase('http://127.0.0.1:8090');

export async function getOffre(id) {
    try {
        const data = await pb.collection('Maison').getOne(id);
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la maison', error);
        return null;
    }
}

export async function bySurface(s) {
    const record = await pb.collection('Maison').getFullList({ filter: `superficie > ${s}` });
    return record;
}


export async function getOffreByPrix(p) {
    try {
        const records = await pb
            .collection('Maison')
            .getFullList({ filter: `Prix > ${p}` });
        return records;
    } catch (error) {
        console.log('Une erreur est survenue en lisant les maisons', error);
        return [];
    }
}


export async function addOffre(house) {
    try {
        await pb.collection('Maison').create(house);
        return {
            success: true,
            message: 'Offre ajoutée avec succès'
        };
    } catch (error) {
        console.log('Une erreur est survenue en ajoutant la maison', error);
        return {
            success: false,
            message: 'Une erreur est survenue en ajoutant la maison'
        };
    }
}

export async function updateFavori(offreId, favoriValue) {
    try {
        const record = await pb.collection('Maison').getOne(offreId);
        const payload = {};

        if ('favori' in record) payload.favori = favoriValue;
        if ('favoris' in record) payload.favoris = favoriValue;
        if (Object.keys(payload).length === 0) payload.favori = favoriValue;

        await pb.collection('Maison').update(offreId, payload);

        return {
            success: true,
            message: favoriValue ? 'Maison ajoutée aux favoris' : 'Maison retirée des favoris'
        };
    } catch (error) {
        console.log('Une erreur est survenue en mettant à jour le favori', error);
        return {
            success: false,
            message: 'Une erreur est survenue lors de la mise à jour des favoris'
        };
    }
}

export async function setFavori(house) {
    const nextFavori = !Boolean(house?.favori ?? house?.favoris);
    const payload = {};

    if ('favori' in house) payload.favori = nextFavori;
    if ('favoris' in house) payload.favoris = nextFavori;
    if (Object.keys(payload).length === 0) payload.favori = nextFavori;

    await pb.collection('Maison').update(house.id, payload);
}