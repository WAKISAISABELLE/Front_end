import {useParams, useNavigate} from 'react-router-dom';
//  import {useAuth} from '../../auth/AuthContext.js';
//  import useBranchData from '../../hooks/useBranchData.js';
//  import StockAlert from '../../components/data/StockAlert.js';
import './SalesAgentDashboard.css';


export default function SalesAgentDashboard(){
    const {branch} = useParams();
    const navigate = useNavigate();
    // const {user} = useAuth();
    // if (!user) return <div className='Unauthorized'>Please log in</div>;
    // const {stock, loading, error} = useBranchData(branch);


// //verify agent has access to this branch
//  if(user.role !== 'sales_agent' || user.branch !== branch){
//      return <div className ='Unauthorized'>Unauthorized access</div>;
// }
//  if (loading) return <div className="loading">Loading dashboard...</div>;
//  if (error) return <div className="error">Error: {error}</div>;

return (
    <div className ='sales-agent-dashboard'>
        <div className ='dashboard-container'>
            <div className='dashboard-header'>
                <h1>{branch} Branch - Sales Agent Portal</h1>
                {/* <p>Welcome, {user.name}</p> */}
            </div>

            <div className ='action-buttons'>
                <ActionButton
                title = 'Record New Sale'
                description ='cash or credit transaction'
                icon ='💰'
                onClick={()=> navigate (`/sales-agent/${branch}/new-sale`)}
                color ='green'
            />
            <ActionButton 
            title="Record Procurement"
            description="New produce purchases"
            icon="🛒"
            onClick={() => navigate(`/sales-agent/${branch}/procurement`)}
            color="blue"
          />
           <ActionButton 
            title="Credit Sales"
            description="Manage pending payments"
            icon="📝"
            onClick={() => navigate(`/sales-agent/${branch}/credit-sales`)}
            color="purple"
          />
        </div>

        <div className="stock-card">
          <h2>Current Stock</h2>
          {/* <StockAlert stock={stock} threshold={10} /> */}
        </div>

        <div className="activity-card">
          <h2>Your Recent Activity</h2>
          <p>Last 5 transactions will appear here</p>
        </div>
      </div>
    </div>
  );
}
function ActionButton({title, description, icon, onClick, color}){
    return(
      <button
         onClick ={onClick}
         className ={`action-button ${color}`}
      >
         <div className ='button-content'>
            <span className ='button-icon'>{icon}</span>
            <div>
               <h3>{title}</h3>
               <p>{description}</p>
             </div>
         </div>
        </button>
    );
}
