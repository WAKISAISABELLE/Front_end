"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext"
import axios from "axios"
import * as Yup from "yup"
import "./SalesForm.css"

const salesSchema = Yup.object().shape({
  produceName: Yup.string().required("Required"),
  tonnage: Yup.number().required("Required").positive("Must be positive"),
  amount: Yup.number().required("Required").positive("Must be positive"),
  buyerName: Yup.string().required("Required"),
  buyerContact: Yup.string().matches(/^\+256\d{9}$/, "Invalid Ugandan phone format"),
  isCredit: Yup.boolean(),
})

export default function SalesForm() {
  const { branch } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/sales`, {
        ...values,
        branchId: branch, // Changed from branch to branchId
        agentId: user.id, // Changed from user._id to user.id
        agentName: user.name,
      })

      navigate(`/sales-agent/${branch}/dashboard`)
    } catch (error) {
      console.error("Submission error:", error)
      setStatus({ error: error.response?.data?.message || "Failed to record sale" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="sales-form-container">
      <div className="form-card">
        <h1>Record Sale</h1>
        <Formik
          initialValues={{
            produceName: "",
            tonnage: "",
            amount: "",
            buyerName: "",
            buyerContact: "",
            isCredit: false,
          }}
          validationSchema={salesSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status, values }) => (
            <Form className="sales-form">
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tonnage">Tonnage (tons)</label>
                  <Field type="number" name="tonnage" id="tonnage" step="0.1" />
                  <ErrorMessage name="tonnage" component="div" className="error-message" />
                </div>

                <div className="form-group">
                  <label htmlFor="amount">Amount (UGX)</label>
                  <Field type="number" name="amount" id="amount" />
                  <ErrorMessage name="amount" component="div" className="error-message" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="buyerName">Buyer Name</label>
                <Field type="text" name="buyerName" id="buyerName" />
                <ErrorMessage name="buyerName" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="buyerContact">Buyer Contact (+256XXXXXXXXX)</label>
                <Field type="tel" name="buyerContact" id="buyerContact" placeholder="+256" />
                <ErrorMessage name="buyerContact" component="div" className="error-message" />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <Field type="checkbox" name="isCredit" />
                  <span>Credit Sale</span>
                </label>
                <ErrorMessage name="isCredit" component="div" className="error-message" />
              </div>

              {values.isCredit && (
                <div className="credit-notice">
                  <p>This sale will be recorded as credit with a 30-day payment period.</p>
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
                <button type="submit" disabled={isSubmitting} className="submit-button">
                  {isSubmitting ? "Processing..." : "Record Sale"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
