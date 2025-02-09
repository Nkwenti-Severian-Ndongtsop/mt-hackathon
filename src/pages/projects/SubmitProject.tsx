import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FileText, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const ProjectSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .min(20, 'Too Short!')
    .max(1000, 'Too Long!')
    .required('Required'),
  targetAmount: Yup.number()
    .min(1000, 'Minimum amount is $1,000')
    .required('Required'),
  repaymentPeriod: Yup.number()
    .min(1, 'Minimum 1 month')
    .max(60, 'Maximum 60 months')
    .required('Required'),
});

export default function SubmitProject() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-center mb-8">
            <FileText className="h-12 w-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Submit Your Project
          </h1>

          <Formik
            initialValues={{
              title: '',
              description: '',
              targetAmount: 1000,
              repaymentPeriod: 12,
            }}
            validationSchema={ProjectSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const { error } = await supabase.from('projects').insert([
                  {
                    user_id: user?.id,
                    title: values.title,
                    description: values.description,
                    target_amount: values.targetAmount,
                    repayment_schedule: {
                      period_months: values.repaymentPeriod,
                      monthly_payment: values.targetAmount / values.repaymentPeriod,
                    },
                  },
                ]);

                if (error) throw error;

                toast.success('Project submitted successfully!');
                navigate('/dashboard');
              } catch (error: any) {
                toast.error(error?.message || 'An error occurred');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Project Title
                  </label>
                  <Field
                    id="title"
                    name="title"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.title && touched.title && (
                    <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Project Description
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.description && touched.description && (
                    <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
                    Target Amount ($)
                  </label>
                  <Field
                    id="targetAmount"
                    name="targetAmount"
                    type="number"
                    min="1000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.targetAmount && touched.targetAmount && (
                    <p className="mt-2 text-sm text-red-600">{errors.targetAmount}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="repaymentPeriod" className="block text-sm font-medium text-gray-700">
                    Repayment Period (months)
                  </label>
                  <Field
                    id="repaymentPeriod"
                    name="repaymentPeriod"
                    type="number"
                    min="1"
                    max="60"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.repaymentPeriod && touched.repaymentPeriod && (
                    <p className="mt-2 text-sm text-red-600">{errors.repaymentPeriod}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isSubmitting ? (
                      <Loader className="animate-spin h-5 w-5" />
                    ) : (
                      'Submit Project'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}