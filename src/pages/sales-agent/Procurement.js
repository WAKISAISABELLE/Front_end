

import { Formik, Form, Field, ErrorMessage } from "formik"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext"
import axios from "axios"
import * as Yup from "yup"
import "./ProcurementForm.css"

const procurementSchema = Yup.object().shape({
  produceName: Yup.string().required("Required"),
  produceType: Yup.string(),
  tonnage: Yup.number().required("Required").positive("Must be positive"),
  cost: Yup.number().required("Required").positive("Must be positive"),
  dealerName: Yup.string().required("Required"),
  dealerContact: Yup.string()
    .required("Required")
    .matches(/^\+256\d{9}$/, "Invalid Ugandan phone format"),
})

export default function ProcurementForm() {
  const { branch } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/procurements`, {
        ...values,
        branchId: branch, // Changed from branch to branchId
        recordedBy: user.id, // Changed from user._id to user.id
      })

      navigate(`/sales-agent/${branch}/dashboard`)
    } catch (error) {
      console.error("Submission error:", error)
      setStatus({ error: error.response?.data?.message || "Failed to record procurement" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="procurement-form-container">
      <div className="form-card">
        <h1>Record Procurement</h1>
        <Formik
          initialValues={{
            produceName: "",
            produceType: "",
            tonnage: "",
            cost: "",
            dealerName: "",
            dealerContact: "",
          }}
          validationSchema={procurementSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="procurement-form">
              {status && status.error && <div className="error-message form-error">{status.error}</div>}

              <div className="form-group">
                <label htmlFor="produceName">Produce Name</label>
                <Field as="select" name="produceName" id="produceName">
                  <option value="">Select produce</option>
                  <option value="beans">Beans</option>
                  <option value="maize">Grain Maize</option>
                  <option value="rice">Rice</option>
                  <option value="soybeans">Soybeans</option>
                  <option value="groundnuts">Groundnuts</option>
                </Field>
                <ErrorMessage name="produceName" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="produceType">Produce Type</label>
                <Field type="text" name="produceType" id="produceType" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tonnage">Tonnage (tons)</label>
                  <Field type="number" name="tonnage" id="tonnage" step="0.1" />
                  <ErrorMessage name="tonnage" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="cost">Cost (UGX)</label>
                  <Field type="number" name="cost" id="cost" />
                  <ErrorMessage name="cost" component="div" className="error-message" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dealerName">Dealer Name</label>
                <Field type="text" name="dealerName" id="dealerName" />
                <ErrorMessage name="dealerName" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="dealerContact">Dealer Contact (+256XXXXXXXXX)</label>
                <Field type="tel" name="dealerContact" id="dealerContact" placeholder="+256" />
                <ErrorMessage name="dealerContact" component="div" className="error-message" />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate(`/sales-agent/${branch}/dashboard`)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="submit-button">
                  {isSubmitting ? "Processing..." : "Record Procurement"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
