import './StockAlert.css';

export default function StockAlert ({stock, threshold=5}){
    const lowStockItems = stock.filter(item => item.quantity <= threshold);
    return (
     <div className ='stock-alert'>
        {lowStockItems.length > 0 ? (
            <div className='alert-content'>
                <p className='alert-title'>
                    Low Stock Alert ({lowStockItems.length} items)
                </p>
                <ul className ='alert-items'>
                    {lowStockItems.map(item =>(
                        <li key ={item._id} className='alert-item'>
                            <span>{item.produceName}</span>
                            <span className='quantity'>{item.quantity}Tons left</span>
                        </li>
                    ))}
                </ul>
            </div>

        ):(
            <p className='adequate-stock'>
                All stock levels adequate
            </p>
        )}
        <div className ='stock-summary'>
            <p>Total items in stock: {stock.length}</p>
        </div>
     </div>
    );

    
}