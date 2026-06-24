import origLink from './models/origLink.js'

const getLinks = async (req,res) => {
    try {
        const links = await origLink.findAll();
        res.status(200).json(links); //change this for pgsql @TODO
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving links', error: error.message }); //change this for pgsql @TODO
    }
};

const getLinksById = async (req,res) => {
    try {
        const user = await origLink.getLinksById(req.params.id); //this might be an issue later @TODO
        if(!link) { //this might be an issue later @TODO
            return res.status(404).json({ message: 'Links not found' }); //change this for pgsql @TODO
        }
        res.status(200).json(links);     //change this for pgsql @TODO
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving link', error: error.message });
    }
};

const createLink = async (req,res) => {
    try {
        const link = await new origLink(req.body);
        res.status(201).json(link);      //change this for pgsql @TODO
    } catch (error) {
        res.status(400).json({message: 'Error creating link', error: error.message});
    }
};

/*const updateLink = async (req, res) => {
    try {
        const link = 
    }
};

const deleteLink*/