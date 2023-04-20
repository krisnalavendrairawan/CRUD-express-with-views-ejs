
const connection = require('../library/database');

class postController {
    
    //get all posts 
    static getAllposts(req, res, next){
        connection.query('SELECT * FROM posts ORDER BY id DESC', function(err, rows, fields){
            if(err) throw err
            //render to views/posts/index.ejs template file
            res.render('posts/index', {
                title: 'Posts List',
                data: rows,
            })
        })
    }

    static createPost(req, res, next){
        res.render('posts/create', {
            title: 'Create Posts',
            content : '',

        })
    }

    //store with userid
    static storePost(req, res, next){
        let title = req.body.title;
        let content = req.body.content;
        let errors = false;
        if(title.length === 0){
            errors = true;
            req.flash('error', "Please enter title");
            res.render('posts/create', {
                title: title,
                content: content
            })
        }
        if(!errors){
            let formData = {
                title: title,
                content: content,
            }
            connection.query('INSERT INTO posts SET ?', formData, function(err, result){
                if(err) throw err;
                req.flash('success', 'Posts successfully added');
                res.redirect('/posts');
            })
        }
    }

    static editPost(req, res, next){
        let id = req.params.id;
        connection.query('SELECT * FROM posts WHERE id = ' + id, function(err, rows, fields){
            if(err) throw err

            //if posts not found
            if(rows.length <= 0){
                req.flash('error', 'Posts not found with id = ' + id)
                res.redirect('/posts')
            }else{
                //render to edit.ejs
                res.render('posts/edit', {
                    title: 'Edit Posts',
                    id: rows[0].id,
                    title: rows[0].title,
                    content: rows[0].content
                })
            }
        })
    }

    static updatePost(req, res, next){
        let id = req.params.id;
        let title = req.body.title;
        let content = req.body.content;
        let errors = false;
        
        if(title.length === 0){
            errors = true;
            req.flash('error', "Please enter title");
            res.render('posts/edit', {
                id: req.params.id,
                title: title,
                content: content
            })
        }
        if( !errors ){
            let formData = {
                title: title,
                content: content
            }
            connection.query('UPDATE posts SET ? WHERE id = ' + id, formData, function(err, result){
                if(err){
                    req.flash('error', err)
                    res.render('posts/edit', {
                        id: req.params.id,
                        title: formData.title,
                        content: formData.content
                    })
                }else{
                    const userid = req.session.user.id;
                    req.flash('success', `Post successfully updated with title = ${userid}`);
                    res.redirect('/posts');
                }
            })
        }
    }

    static deletePost(req, res, next){
        let id = req.params.id;
        connection.query('DELETE FROM posts WHERE id = ' + id, function(err, result){
            if(err){
                req.flash('error', err)
                res.redirect('/posts')
            }else{
                req.flash('success', 'Post successfully deleted');
                res.redirect('/posts');
            }
        })
    }
}

module.exports =  postController ;