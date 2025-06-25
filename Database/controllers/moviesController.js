const movies = require('../models/moviesModel')

exports.getAllmovies = async (req, res) => {
    try {
        const movieList = await movies.find();
        return res.status(200).send({ movies: movieList });
    } catch (error) {
        console.error(`Error fetching all movies:`, error.message)
        return res.status(500).send({ error: `Error fetching all movies` })
    }
}

exports.getmovieById = async (req, res) => {
    const id = req.params.id;
    try {
        const movie = await movies.findById(id);
        if (!movie) {
            return res.status(404).send({ error: 'movie not found' })
        }
        return res.status(200).send({ movie: movie })
    } catch (error) {
        console.error('Error fetching movie:', error.message);
        return res.status(500).send({ error: 'Error fetching movie' })
    }
}


exports.createmovie = async (req, res) => {
    const title = req.body.title;
    try {
        const newmovie = new movies({ title: title, createdBy: req.user })
        const savedmovie = await newmovie.save();
        return res.status(201).send({ newmovie: savedmovie })
    } catch (error) {
        console.error('Error creating movie:', error.message)
        return res.status(400).send({ error: 'Error creating movie' })
    }
}

exports.updatemovie = async (req, res) => {
    const id = req.params.id
    try {
        const updatedmovie = await movies.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedmovie) {
            return res.status(404).send({ error: 'movie not found' });
        }
        return res.status(200).send({ updatedmovie: updatedmovie });
    } catch (error) {
        console.error('Error updating movie:', error.message);
        return res.status(400).send({ error: 'Error updating movie' });
    }
}

exports.deletemovie = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedmovie = await movies.findByIdAndDelete(id);
        if (!deletedmovie) {
            return res.status(404).send({ error: 'movie not found' });
        }
        return res.status(200).send({ message: 'movie deleted successfully' });
    } catch (error) {
        console.error('Error deleting movie:', error.message);
        return res.status(500).send({ error: 'Error deleting movie' });
    }
}