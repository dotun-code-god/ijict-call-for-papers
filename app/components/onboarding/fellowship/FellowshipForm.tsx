"use client"

import { Fellowship } from '@/classes/Fellowship';
import React, { useActionState, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ZodIssue } from "zod";
import { Campus } from '@prisma/client';
import { Formik, useFormik } from "formik";
import { bankStatementSchema, fellowshipSchema, utilityBillSchema } from '@/api/schemaDefinitions/fellowship';
import { Utility } from '@/classes/ClientUtility';
import { useRouter } from 'next/navigation';

export type State = {
  errors?: ZodIssue[];
  error?: boolean;
  message?: string;
  status?: number;
};

const FellowshipForm = ({ 
    campuses 
} : {
    campuses: Campus[]
}) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedDocument, setSelectedDocument] = useState<FellowshipDocumentType>("Bank Statement");
    const router = useRouter();
    
    const initialValues = {
        name: "",
        motto: "",
        email: "",
        phoneNumber: "",
        primaryColor: "",
        secondaryColor: "",
        address: "",
        subdomain: "",
        campusId: "",
        session: "",
        sessionStartDate: "",
        sessionEndDate: "",
        logo: null,
        bankStatement: null,
        utilityBill: null,
    }

    const handleNext = async (validateForm: () => Promise<any>, setTouched: any) => {
        const errors = await validateForm();

        const step1Fields = ["logo","name","motto","email","phoneNumber","primaryColor","secondaryColor","address","subdomain","campusId","session","sessionStartDate","sessionEndDate"];
        const step1Errors = step1Fields.filter(field => !!errors[field]);
        
        if (step1Errors.length === 0) {
            setStep((prev) => prev + 1);
        }else {
            setTouched(
                Object.fromEntries(step1Fields.map(f => [f, true]))
            );
        }
    };

  return (
    <Formik
        initialValues={initialValues}
        validate={async (values) => {
            const validateFn = await Utility.zodValidate(step == 1 ? fellowshipSchema : (selectedDocument == "Bank Statement" ? bankStatementSchema : utilityBillSchema));
            return validateFn(values);
        }}
        onSubmit={async (values) => {
            try{
                await Fellowship.onboard({...values, documentType: selectedDocument}, setIsSubmitting);
                router.push(`/onboarding/fellowship?ref=callback&s=pending_verification`);
            }catch(error){
                console.log({error});
            }
        }}
    >
        {
            ({ values, errors, touched, setFieldValue, validateForm, setTouched, handleBlur, handleChange, handleSubmit }) => (
                <form method="POST" onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 p-6 bg-white shadow-md rounded-xl">
                    {step === 1 && (
                        <>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Fellowship Onboarding</h2>
                                <div>
                                    <Label htmlFor="logo" className="capitalize py-2">Logo</Label>
                                    <Input 
                                        type="file" 
                                        name="logo" 
                                        id="logo" 
                                        required 
                                        onChange={(e) => {
                                            const file = e.currentTarget.files?.[0] || [];
                                            setFieldValue("logo", file);
                                        }}
                                    />
                                    {touched?.logo && errors?.logo && <div className='error-feedback'>{errors?.logo}</div>}
                                </div>
                                <div>
                                    <Label htmlFor="name" className="py-2">Name</Label>
                                    <Input 
                                        id="name" 
                                        name="name" 
                                        value={values?.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                    {touched?.name && errors?.name && <div className='error-feedback'>{errors?.name}</div>}
                                </div>
                                <div>
                                    <Label htmlFor="email" className="py-2">Email</Label>
                                    <Input 
                                        id="email" 
                                        name="email"
                                        value={values?.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                    />
                                    {touched?.email && errors?.email && <div className='error-feedback'>{errors?.email}</div>}
                                </div>
                                <div>
                                    <Label htmlFor="phoneNumber" className="py-2">Phone number</Label>
                                    <Input 
                                        id="phoneNumber" 
                                        name="phoneNumber" 
                                        value={values?.phoneNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                    />
                                    {touched?.phoneNumber && errors?.phoneNumber && <div className='error-feedback'>{errors?.phoneNumber}</div>}
                                </div>
                                <div>
                                    <Label htmlFor="motto" className="py-2">Motto</Label>
                                    <Input 
                                        id="motto" 
                                        name="motto" 
                                        value={values?.motto}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                    {touched?.motto && errors?.motto && <div className='error-feedback'>{errors?.motto}</div>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="address" className="py-2">Address</Label>
                                    <Input 
                                        id="address" 
                                        name="address" 
                                        value={values?.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                    />
                                    {touched?.address && errors?.address && <div className='error-feedback'>{errors?.address}</div>}
                                </div> 

                                <div>
                                    <Label htmlFor="subdomain" className="py-2">Subdomain</Label>
                                    <Input 
                                        id="subdomain" 
                                        name="subdomain" 
                                        value={values?.subdomain}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                    />
                                    {touched?.subdomain && errors?.subdomain && <div className='error-feedback'>{errors?.subdomain}</div>}
                                </div> 
                                
                                <div className="grid grid-cols-2 gap-2">
                                
                                <div>
                                    <Label htmlFor="campusId" className="py-2">Campus</Label>
                                
                                    <Select name="campusId" required value={values?.campusId} onValueChange={(e) => setFieldValue("campusId", e)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Campus" />                                  
                                        </SelectTrigger>
                                        <SelectContent>
                                            {campuses.map((c) => (
                                                <SelectItem key={c.uuid} value={c.uuid}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {touched?.campusId && errors?.campusId && <div className='error-feedback'>{errors?.campusId}</div>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="session" className="py-2">Session</Label>
                                    {/* <Select>
                                        <Option value="2023/2024"></Option>
                                    </Select> */}
                                    <div>
                                        <Label htmlFor="session" className="py-2">Session Name</Label>
                                        <Input 
                                            id="session" 
                                            name="session" 
                                            type="text" 
                                            placeholder='E.g 2023/2024' 
                                            value={values?.session}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {touched?.session && errors?.session && <div className='error-feedback'>{errors?.session}</div>}
                                    </div>
                                    <div>
                                        <Label htmlFor="sessionStartDate" className="py-2">Session Start Date</Label>
                                        <Input 
                                            id="sessionStartDate" 
                                            name="sessionStartDate" 
                                            type="date" 
                                            value={values?.sessionStartDate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {touched?.sessionStartDate && errors?.sessionStartDate && <div className='error-feedback'>{errors?.sessionStartDate}</div>}
                                    </div>
                                    <div>
                                        <Label htmlFor="sessionEndDate" className="py-2">Session End Date</Label>
                                        <Input 
                                            id="sessionEndDate" 
                                            name="sessionEndDate" 
                                            type="date" 
                                            value={values?.sessionEndDate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {touched?.sessionEndDate && errors?.sessionEndDate && <div className='error-feedback'>{errors?.sessionEndDate}</div>}
                                    </div>
                                </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                
                                    <div>
                                        <Label htmlFor="primaryColor" className="py-2">Primary Color</Label>
                                        <Input 
                                            id="primaryColor" 
                                            name="primaryColor" 
                                            type="color" 
                                            value={values?.primaryColor}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {touched?.primaryColor && errors?.primaryColor && <div className='error-feedback'>{errors?.primaryColor}</div>}
                                    </div>
                                    <div>
                                        <Label htmlFor="secondaryColor" className="py-2">Secondary Color</Label>
                                        <Input 
                                            id="secondaryColor" 
                                            name="secondaryColor" 
                                            type="color" 
                                            value={values?.secondaryColor}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {touched?.secondaryColor && errors?.secondaryColor && <div className='error-feedback'>{errors?.secondaryColor}</div>}
                                    </div>
                                </div>
                            </div>
                            <Button type="button" onClick={() => handleNext(validateForm, setTouched)}>
                                Next
                            </Button>
                        </>
                    )}
                    
                    
                    {step === 2 && (
                        <>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Fellowship Documents</h2>
                                <div>
                                    {/* <Label htmlFor="selectedDocument" className="py-2">Select Document</Label> */}
                                
                                    <Select name="selectedDocument" required value={selectedDocument} onValueChange={(e:FellowshipDocumentType) => setSelectedDocument(e)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Document" />                                  
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["Utility Bill", "Bank Statement"].map((d, i) => (
                                                <SelectItem key={i} value={d}>
                                                    {d}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {
                                    selectedDocument == "Bank Statement" && (
                                        <div>
                                            <Label htmlFor="bankStatement" className="capitalize py-2">Bank Statement (Image)</Label>
                                            <Input 
                                                type="file" 
                                                name="bankStatement" 
                                                id="bankStatement" 
                                                onChange={(e) => {
                                                    const file = e.currentTarget.files?.[0] || [];
                                                    setFieldValue("bankStatement", file, selectedDocument == "Bank Statement");
                                                }}
                                            />
                                            {touched?.bankStatement && errors?.bankStatement && <div className='error-feedback'>{errors?.bankStatement}</div>}
                                        </div>
                                    )
                                }
                                {
                                    selectedDocument == "Utility Bill" && (
                                        <div>
                                            <Label htmlFor="utilityBill" className="capitalize py-2">Utility Bill (Image)</Label>
                                            <Input 
                                                type="file" 
                                                name="utilityBill" 
                                                id="utilityBill" 
                                                onChange={(e) => {
                                                    const file = e.currentTarget.files?.[0] || [];
                                                    setFieldValue("utilityBill", file, selectedDocument == "Utility Bill");
                                                }}
                                            />
                                            {touched?.utilityBill && errors?.utilityBill && <div className='error-feedback'>{errors?.utilityBill}</div>}
                                        </div>
                                    )
                                }
                            </div>
                            <Button type="button" onClick={() => setStep(1)}>
                                Previous
                            </Button>
                            <button type="submit" disabled={isSubmitting} className="bg-purple-600 text-white px-4 py-2 rounded">
                            {isSubmitting ? "Creating..." : "Create Fellowship"}
                        </button>
                        </>
                    )}
                </form>
            )
        }
    </Formik>
  )
}

export default FellowshipForm;