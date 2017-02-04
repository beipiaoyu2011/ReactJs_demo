
var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

var ProductCategoryRow = React.createClass({
    render:function(){
        return(<tr className="productsRow"><td colSpan="2">{this.props.category}</td></tr>);
    }
});

var ProductRow = React.createClass({
    render:function(){
        var name = this.props.product.stocked ? this.props.product.name : <span style={{color: 'red'}}>{this.props.product.name}</span>;
        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        )
    }
});

var ProductTable= React.createClass({
    render:function(){
        var rows=[],
            lastCategory= null;
        this.props.products.forEach(function(product){
            if(product.name.indexOf(this.props.filterText)=== -1 || (!product.stocked && this.props.isStockedOnly)) return;
            if(product.category !== lastCategory){
                rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
            }
            rows.push(<ProductRow product={product} key={product.name} />);
            lastCategory = product.category;
        }.bind(this));
        return (
            <table className="productTable">
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Price</td>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
});

var SearchBar = React.createClass({
    onInputChange:function(){
        console.log(this.refs);
        this.props.onUserInput(
            this.refs.isFilterModel.value,
            this.refs.isStockModel.checked
        )
    },
    render:function(){
        return (
            <form>
                <input type="text" placeholder="Searcing..." value={this.props.filterText} ref='isFilterModel' onChange={this.onInputChange} /><br/><br/>
                <input type="checkbox" checked={this.props.isStockedOnly} ref="isStockModel" onChange={this.onInputChange} /> only show products in stocks
            </form>
        );
    }
});

var FilterableProductTable = React.createClass({
    getInitialState:function(){
        return {
            filterText:'',
            isStockedOnly: false
        }
    },
    handleUserInput:function(filterText, isStockedOnly){
        this.setState({
            filterText: filterText,
            isStockedOnly: isStockedOnly
        });
    },
    render:function(){

        return (
            <div className="productBox">
                <SearchBar
                filterText={this.state.filterText}
                isStockedOnly={this.state.isStockedOnly}
                onUserInput={this.handleUserInput}/>
                <ProductTable
                products={this.props.products}
                filterText={this.state.filterText}
                isStockedOnly={this.state.isStockedOnly} />
            </div>
        );
    }
});

ReactDOM.render(
    <FilterableProductTable products={PRODUCTS} />,
    document.getElementById('product')
);
