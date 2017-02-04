// data
// var data = [
//   {id: 1, author: "Pete Hunt", text: "This is one comment"},
//   {id: 2, author: "Jordan Walke", text: "This is *another* comment"},
//   {id: 3, author: "John wileen", text: "This is *three* comment"}
// ];

var Comment = React.createClass({
    rawMarkup:function(){
        var md=new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },
    render:function(){
        return (
            <div className="comment">
                <h2 className="commentAuthor"> { this.props.author } </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function(){
        var commentNodes=this.props.data.map(function(comment){
            return (
                <Comment author={comment.author} key={comment.id}>
                    {comment.text}
                </Comment>
            )
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState:function(){
        return {
            author:'',
            text:''
        }
    },
    handleAuthorChange:function(e){
        this.setState({author: e.target.value});
    },
    handleTextChange:function(e){
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e){
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if(!author || !text) return;
        this.props.onCommentSubmit({
            author: author,
            text: text
        })
        console.log(this.state);
        //TODO: send the request to the server
        this.setState({
            author:'',
            text:''
        })
    },
    render: function(){
        return (
          <form className="commentForm" onSubmit={this.handleSubmit}>
            <input type="text" placeholder="Your name" value={this.state.author} onChange={this.handleAuthorChange} /><br/><br/>
            <input type="text" placeholder="Say something..." value={this.state.text} onChange={this.handleTextChange} /><br/><br/>
            <input type="submit" value="Post" />
          </form>
        );
    }
});

var CommentBox = React.createClass({
    loadCommentsFromServer:function(){
        $.ajax({
            url: this.props.url,
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function(data){
                this.setState({data: data})
            }.bind(this)
        })
        .done(function() {
            console.log("success");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
    },
    handleCommentSubmit:function(comment){
        //to show first
        var comments =this.state.data;
        comment.id=Date.now();
        var newComments = comments.splice(0,0,comment);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.url,
            type: 'POST',
            data: comment,
            dataType: 'json',
            success:function(data){
                this.setState({data: data});
            }.bind(this)
        })
        .done(function() {
            console.log("success");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });

    },
    getInitialState:function(){
        return {data:[]};
    },
    componentDidMount: function(){
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function(){
        return(
            <div className="commentBox">
                <CommentForm  onCommentSubmit={this.handleCommentSubmit} />
                <h1>Comments</h1>
                <CommentList  data={this.state.data} />
            </div>
        );
    }
});
ReactDOM.render(
    <CommentBox url='/api/comments' pollInterval={3000} />,
    document.getElementById('content')
)
