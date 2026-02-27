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