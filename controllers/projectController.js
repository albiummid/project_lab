const allProjects = ( req, res ) =>
{
    res.status( 200 ).json( {
        success: true,
        message: 'Yahoo !'
    } )
}

export
{
    allProjects
}