import React from 'react';
import TextInput from '@/Components/Form/TextInput';
import TextArea from '@/Components/Form/TextArea';
import SelectInput from '@/Components/Form/SelectInput';
import InputLabel from '@/Components/Form/InputLabel';
import InputError from '@/Components/Form/InputError';
import Checkbox from '@/Components/Form/Checkbox';

const ShippingForm = ({ formData, setFormData, errors = {} }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleDistrictChange = (e, fieldName = 'district') => {
        const val = e.target ? e.target.value : e;
        setFormData(prev => ({ ...prev, [fieldName]: val }));
    };

    const getError = (field) => {
        return errors[field];
    };

    const districts = [
        { id: '', name: 'Select District' },
        { id: 'Dhaka - City', name: 'Dhaka - City' },
        { id: 'Chattogram', name: 'Chattogram' },
        { id: 'Sylhet', name: 'Sylhet' },
        { id: 'Rajshahi', name: 'Rajshahi' },
        { id: 'Khulna', name: 'Khulna' },
        { id: 'Barishal', name: 'Barishal' },
        { id: 'Rangpur', name: 'Rangpur' },
        { id: 'Mymensingh', name: 'Mymensingh' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <div>
                <InputLabel className="text-[14px] mb-1" value="First Name" />
                <TextInput 
                    name="firstName"
                    placeholder="First Name*" 
                    className="h-10"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <InputError message={getError('firstName')} className="mt-1" />
            </div>
            <div>
                <InputLabel className="text-[14px] mb-1" value="Last Name" />
                <TextInput 
                    name="lastName"
                    placeholder="Last Name*" 
                    className="h-10"
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <InputError message={getError('lastName')} className="mt-1" />
            </div>
            <div className="md:col-span-2">
                <InputLabel className="text-[14px] mb-1" value="Address" />
                <TextInput 
                    name="address"
                    placeholder="Address*" 
                    className="h-10"
                    value={formData.address}
                    onChange={handleChange}
                />
                <InputError message={getError('address')} className="mt-1" />
            </div>
            <div>
                <InputLabel className="text-[14px] mb-1" value="Upazila/Thana" />
                <TextInput 
                    name="upazila"
                    placeholder="Upazila/Thana*" 
                    className="h-10"
                    value={formData.upazila}
                    onChange={handleChange}
                />
                <InputError message={getError('upazila')} className="mt-1" />
            </div>
            <div>
                <InputLabel className="text-[14px] mb-1" value="District" />
                <SelectInput 
                    name="district"
                    options={districts}
                    value={formData.district}
                    onChange={(val) => handleDistrictChange(val, 'district')}
                    className="h-10"
                />
                <InputError message={getError('district')} className="mt-1" />
            </div>
            <div>
                <InputLabel className="text-[14px] mb-1" value="Zip/Postal Code" />
                <TextInput 
                    name="shipping_zip_code"
                    placeholder="Zip/Postal Code" 
                    className="h-10"
                    value={formData.shipping_zip_code}
                    onChange={handleChange}
                />
                <InputError message={getError('shipping_zip_code')} className="mt-1" />
            </div>
            
            <div>
                <InputLabel className="text-[14px] mb-1" value="Mobile" />
                <TextInput 
                    type="tel" 
                    name="mobile"
                    placeholder="Telephone*" 
                    className="h-10"
                    value={formData.mobile}
                    onChange={handleChange}
                />
                <InputError message={getError('mobile')} className="mt-1" />
            </div>
            <div className="md:col-span-2">
                <InputLabel className="text-[14px] mb-1" value="Email" />
                <TextInput 
                    type="email" 
                    name="email"
                    placeholder="E-Mail*" 
                    className="h-10"
                    value={formData.email}
                    onChange={handleChange}
                />
                <InputError message={getError('email')} className="mt-1" />
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                    <InputLabel className="text-[14px] mb-1" value="Company Name (Optional)" />
                    <TextInput 
                        name="company_name"
                        placeholder="Company Name" 
                        className="h-10"
                        value={formData.company_name}
                        onChange={handleChange}
                    />
                    <InputError message={getError('company_name')} className="mt-1" />
                </div>
                <div>
                    <InputLabel className="text-[14px] mb-1" value="VAT ID (Optional)" />
                    <TextInput 
                        name="vat_id"
                        placeholder="VAT ID" 
                        className="h-10"
                        value={formData.vat_id}
                        onChange={handleChange}
                    />
                    <InputError message={getError('vat_id')} className="mt-1" />
                </div>
            </div>

            {/* Billing Address Toggle */}
            <div className="md:col-span-2 flex items-center gap-2 mt-3 mb-1">
                <Checkbox 
                    name="is_billing_same_as_shipping" 
                    id="is_billing_same_as_shipping"
                    checked={formData.is_billing_same_as_shipping}
                    onChange={handleChange}
                />
                <label htmlFor="is_billing_same_as_shipping" className="text-[14px] text-[#081621] font-medium cursor-pointer select-none">
                    My billing address is the same as my shipping address.
                </label>
            </div>

            {/* Billing Address Fields */}
            {!formData.is_billing_same_as_shipping && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 bg-slate-50 p-4 rounded-md border border-slate-100">
                    <h3 className="md:col-span-2 text-[15px] font-bold text-[#081621] border-b border-slate-200 pb-2 mb-1">Billing Details</h3>
                    <div>
                        <InputLabel className="text-[14px] mb-1" value="Full Name" />
                        <TextInput 
                            name="billing_name"
                            placeholder="Full Name*" 
                            className="h-10"
                            value={formData.billing_name}
                            onChange={handleChange}
                        />
                        <InputError message={getError('billing_name')} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel className="text-[14px] mb-1" value="Mobile" />
                        <TextInput 
                            name="billing_phone"
                            placeholder="Telephone*" 
                            className="h-10"
                            value={formData.billing_phone}
                            onChange={handleChange}
                        />
                        <InputError message={getError('billing_phone')} className="mt-1" />
                    </div>
                    <div className="md:col-span-2">
                        <InputLabel className="text-[14px] mb-1" value="Address" />
                        <TextInput 
                            name="billing_address"
                            placeholder="Address*" 
                            className="h-10"
                            value={formData.billing_address}
                            onChange={handleChange}
                        />
                        <InputError message={getError('billing_address')} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel className="text-[14px] mb-1" value="Upazila/Thana" />
                        <TextInput 
                            name="billing_upazila"
                            placeholder="Upazila/Thana" 
                            className="h-10"
                            value={formData.billing_upazila}
                            onChange={handleChange}
                        />
                        <InputError message={getError('billing_upazila')} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel className="text-[14px] mb-1" value="District" />
                        <SelectInput 
                            name="billing_district"
                            options={districts}
                            value={formData.billing_district}
                            onChange={(val) => handleDistrictChange(val, 'billing_district')}
                            className="h-10"
                        />
                        <InputError message={getError('billing_district')} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel className="text-[14px] mb-1" value="Zip/Postal Code" />
                        <TextInput 
                            name="billing_zip_code"
                            placeholder="Zip/Postal Code" 
                            className="h-10"
                            value={formData.billing_zip_code}
                            onChange={handleChange}
                        />
                        <InputError message={getError('billing_zip_code')} className="mt-1" />
                    </div>
                    <div>
                        <InputLabel className="text-[14px] mb-1" value="Email (Optional)" />
                        <TextInput 
                            type="email"
                            name="billing_email"
                            placeholder="E-Mail" 
                            className="h-10"
                            value={formData.billing_email}
                            onChange={handleChange}
                        />
                        <InputError message={getError('billing_email')} className="mt-1" />
                    </div>
                </div>
            )}

            <div className="md:col-span-2 mt-2">
                <InputLabel className="text-[14px] mb-1" value="Delivery Instructions / Comment" />
                <TextArea 
                    name="delivery_instructions"
                    placeholder="Any special requirement/instruction for delivery?" 
                    className="h-20 resize-none"
                    value={formData.delivery_instructions}
                    onChange={handleChange}
                />
                <InputError message={getError('delivery_instructions')} className="mt-1" />
            </div>
        </div>
    );
};

export default ShippingForm;
