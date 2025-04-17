import {Formik, Form, Field, ErrorMessage} from 'formik';
import {useParams, useNavigate} from 'react-router-dom';
// import {useAuth} from '../../auth/AuthContext.js';
import * as Yup from 'yup';
import './SalesForm.css';

const salesSchema = Yup.object().shape({
    produceName: Yup.string().required('Required'),
    tonnage: Yup.number()
      .required('Required')
      .positive('Must be positive'),
    amount: Yup.number()
      .required('Required')
      .positive('Must be positive'),
    buyerName: Yup.string().required('Required'),
    isCredit: Yup.boolean(),
    buyerContact: Yup.string().when('isCredit', {
      is: true,
      then: Yup.string()
        .required('Required for credit sales')
        .matches(/^\+256\d{9}$/, 'Invalid Ugandan phone format')
    })
  });
 export default function SalesForm(){
     const {branch} =useParams();
    // const {user} =useAuth();
    const navigate = useNavigate();

    // temporary data
    const user={
      _id: 'test-user-id',
      name:'Test User',
      role:'sales_agent'
    };

    const handleSubmit = async (values, {setSubmitting}) =>{
        try {
            const response = await fetch('api/sales', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...values,
                    branch, 
                    agentId: user._id,
                    agentName: user.name
                })
            });

            if (!response.ok) throw new Error('Failed to record sale');
            navigate(`/sales-agent/${branch}/dashboard`);
        
        }catch (error){
            console.error('Submission error:', error);
        }finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="sales-form-container">
            <div className='form-card'>
                <h1>Record New Sales</h1>
                <Formik
                 initialValues={{
                    produceName:'',
                    tonnage: '',
                    amount: '',
                    buyerName: '',
                    isCredit: false,
                    buyerContact: ''
                    }}
                    validationSchema={salesSchema}
                    onSubmit={handleSubmit}
                    >
                        {({isSubmitting, values}) => (
                            <Form className="sales-form">
                            <div className="form-group">
                              <label htmlFor="produceName">Produce</label>
                              <Field
                                as="select"
                                name="produceName"
                                id="produceName"
                              >
                                <option value="">Select produce</option>
                                <option value="beans">Beans</option>
                                <option value="maize">Grain Maize</option>
                                <option value="rice">Rice</option>
                                <option value="soybeans">Soybeans</option>
                                <option value='groundnuts'>Groundnuts</option>
                              </Field>
                              <ErrorMessage name="produceName" component="div" className="error-message" />
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label htmlFor="tonnage">Tonnage (tons)</label>
                                <Field
                                   type="number"
                                   name="tonnage"
                                   id="tonnage"
                                   step="0.1"
                                 />
                                 <ErrorMessage name="tonnage" component="div" className="error-message" />
                              </div>

                              <div className="form-group">
                                <label htmlFor="amount">Amount (UGX)</label>
                                <Field
                                  type="number"
                                  name="amount"
                                  id="amount"
                                />
                                <ErrorMessage name="amount" component="div" className="error-message" />
                               </div>
                           </div>

                           <div className="form-group">
                             <label htmlFor="buyerName">Buyer Name</label>
                             <Field
                               type="text"
                               name="buyerName"
                               id="buyerName"
                              />
                              <ErrorMessage name="buyerName" component="div" className="error-message" />
                          </div>

                          <div className="checkbox-group">
                            <Field
                             type="checkbox"
                             name="isCredit"
                             id="isCredit"
                            />
                            <label htmlFor="isCredit">Credit Sale</label>
                          </div>

                          {values.isCredit && (
                            <div className="form-group">
                               <label htmlFor="buyerContact">Buyer Phone (+256XXXXXXXXX)</label>
                               <Field
                                 type="tel"
                                 name="buyerContact"
                                 id="buyerContact"
                                 placeholder="+256"
                                />
                                <ErrorMessage name="buyerContact" component="div" className="error-message" />
                          </div>
                        )}

                        <div className="form-actions">
                          <button
                            type="button"
                            onClick={() => navigate(`/sales-agent/${branch}/dashboard`)}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="submit-button"
                          >
                            {isSubmitting ? 'Processing...' : 'Record Sale'}
                          </button>
                     </div>
                 </Form>
               )}
           </Formik>
       </div>
     </div>
  );
}






            