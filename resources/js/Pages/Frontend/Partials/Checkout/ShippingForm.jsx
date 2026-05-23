import React from 'react';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import SelectInput from '@/Components/SelectInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const ShippingForm = ({ formData, setFormData, errors = {} }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDistrictChange = (e) => {
        const val = e.target ? e.target.value : e;
        setFormData(prev => ({ ...prev, district: val }));
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <InputLabel className="text-[14px] mb-2" value="First Name" />
                <TextInput 
                    name="firstName"
                    placeholder="First Name*" 
                    className="h-11"
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <InputError message={getError('firstName')} className="mt-1" />
            </div>
            <div>
                <InputLabel className="text-[14px] mb-2" value="Last Name" />
                <TextInput 
                    name="lastName"
                    placeholder="Last Name*" 
                    className="h-11"
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <InputError message={getError('lastName')} className="mt-1" />
            </div>
            <div className="md:col-span-2">
                <InputLabel className="text-[14px] mb-2" value="Address" />
                <TextInput 
                    name="address"
                    placeholder="Address*" 
                    className="h-11"
                    value={formData.address}
                    onChange={handleChange}
                />
                <InputError message={getError('address')} className="mt-1" />
            </div>
            <div>
                <InputLabel className="text-[14px] mb-2" value="Upazila/Thana" />
                <TextInput 
                    name="upazila"
                    placeholder="Upazila/Thana*" 
                    className="h-11"
                    value={formData.upazila}
                    onChange={handleChange}
                />
                <InputError message={getError('upazila')} className="mt-1" />
            </div>
            <div>
                <InputLabel className="text-[14px] mb-2" value="District" />
                <SelectInput 
                    name="district"
                    options={districts}
                    value={formData.district}
                    onChange={handleDistrictChange}
                    className="h-11"
                />
                <InputError message={getError('district')} className="mt-1" />
            </div>
            <div>
                <InputLabel className="text-[14px] mb-2" value="Mobile" />
                <TextInput 
                    type="tel" 
                    name="mobile"
                    placeholder="Telephone*" 
                    className="h-11"
                    value={formData.mobile}
                    onChange={handleChange}
                />
                <InputError message={getError('mobile')} className="mt-1" />
            </div>
            <div>
                <InputLabel className="text-[14px] mb-2" value="Email" />
                <TextInput 
                    type="email" 
                    name="email"
                    placeholder="E-Mail*" 
                    className="h-11"
                    value={formData.email}
                    onChange={handleChange}
                />
                <InputError message={getError('email')} className="mt-1" />
            </div>
            <div className="md:col-span-2 mt-2">
                <InputLabel className="text-[14px] mb-2" value="Comment" />
                <TextArea 
                    name="comment"
                    placeholder="Any special requirement/instruction for us?" 
                    className="h-24 resize-none"
                    value={formData.comment}
                    onChange={handleChange}
                />
                <InputError message={getError('comment')} className="mt-1" />
            </div>
        </div>
    );
};

export default ShippingForm;
