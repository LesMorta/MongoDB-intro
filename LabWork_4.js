const mongoose = require('mongoose');

main().catch(err => console.log(err));
let Department, Doctor, Patient, Diagnosis, MedicalHistory;

async function main() {
    await connectToDB();
    await generateSchemes();
    const departments = await Department.find();
    if (departments.length === 0) {
        console.log('No data found, creating example data...');
        await createExampleData();
    }
    await performBasic();
    await disconnectFromDB();
}

async function connectToDB() {
    try{
        // await mongoose.connect('mongodb+srv://main:2559@cluster0.bajz98z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        await mongoose.connect('mongodb://localhost:27017/CIS');
        console.log('Connected to DB');
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err);
    }
}
async function disconnectFromDB() {
    console.log('Disconnecting from DB');
    try {
        await mongoose.disconnect();
        console.log('Disconnected from DB successfully');
    } catch (err) {
        console.error('Error disconnecting from DB:', err);
    }
}

async function generateSchemes() {
    const departmentSchema = new mongoose.Schema({
        departmentName: String,
        floor: Number,
        officeNumber: Number,
        nameOfTheManager: String
      });
      
    const doctorSchema = new mongoose.Schema({
        surname: String,
        name: String,
        middleName: String,
        position: String,
        workExperience: Number,
        scientificTitle: String,
        address: String,
        departmentNumber: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
      });
      
    const patientSchema = new mongoose.Schema({
        surname: String,
        name: String,
        middleName: String,
        sex: String,
        age: Number,
        city: String,
        address: String
      });
      
    const diagnosisSchema = new mongoose.Schema({
        diagnosis: String,
        signOfIllness: String,
        treatmentPeriod: Number,
        appointment: String
      });
      
    const medicalhistorySchema = new mongoose.Schema({
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
        diagnosis: { type: mongoose.Schema.Types.ObjectId, ref: 'Diagnosis' },
        treatment: String,
        dateOfIllness: Date,
        dateOfTreatment: Date,
        typeOfTreatment: String
      });
           
    Department = mongoose.model('Department', departmentSchema);
    Doctor = mongoose.model('Doctor', doctorSchema);
    Patient = mongoose.model('Patient', patientSchema);
    Diagnosis = mongoose.model('Diagnosis', diagnosisSchema);
    MedicalHistory = mongoose.model('MedicalHistory', medicalhistorySchema);
      
    module.exports = {
        Department,
        Doctor,
        Patient,
        Diagnosis,
        MedicalHistory
    };
    console.log('Schemas generated');
}

async function createExampleData() {
    try {
      // Create departments
      const emergency = await Department.create({ departmentName: 'Emergency', floor: 3, officeNumber: 303, nameOfTheManager: 'Martin Bennet'});
      const internalmedicine = await Department.create({ departmentName: 'InternalMedicine', floor: 2, officeNumber: 210, nameOfTheManager: 'Max Tomphson'});
  
      // Create doctors
      const doctor1 = await Doctor.create({ surname: 'Smith', name: 'John', middleName: 'Doe', position: 'Cardiologist', workExperience: 5, scientificTitle: 'MD', address: '123 Main St', departmentNumber: emergency._id });
      const doctor2 = await Doctor.create({ surname: 'Johnson', name: 'Alice', middleName: 'Smith', position: 'Pediatrician', workExperience: 8, scientificTitle: 'PhD', address: '456 Elm St', departmentNumber: internalmedicine._id });
  
      // Create patients
      const patient1 = await Patient.create({ surname: 'Doe', name: 'Jane', middleName: 'Smith', sex: 'Female', age: 30, city: 'Los Angeles', address: '789 Oak St' });
        const patient2 = await Patient.create({ surname: 'Brown', name: 'Michael', middleName: 'Johnson', sex: 'Male', age: 45, city: 'Austin', address: '101 Pine St' });
  
      // Create diagnoses
      const diagnosis1 = await Diagnosis.create({ diagnosis: 'Heart Attack', signOfIllness: 'Chest pain', treatmentPeriod: 7, appointment: 'Bed rest' });
      const diagnosis2 = await Diagnosis.create({ diagnosis: 'Influenza', signOfIllness: 'Fever, cough', treatmentPeriod: 5, appointment: 'Antivirals' });

      // Create medical history
      const medicalhistory1 = await MedicalHistory.create({ patient: patient1._id, doctor: doctor1._id, diagnosis: diagnosis1._id, treatment: 'Administered medication as prescribed', dateOfIllness: new Date('2023-01-15'), dateOfTreatment: new Date('2023-01-20'), typeOfTreatment: 'Medication' });
      const medicalhistory2 = await MedicalHistory.create({ patient: patient2._id, doctor: doctor2._id, diagnosis: diagnosis2._id, treatment: 'Bed rest and fluids', dateOfIllness: new Date('2023-02-10'), dateOfTreatment: new Date('2023-02-15'), typeOfTreatment: 'Rest' });

    console.log('Example data created successfully.');
    } catch (error) {
        console.error('Error creating example data:', error);
    }
}
async function performBasic() {
    console.log('---------Performing basic operations---------');
    // Example usage of CRUD operations
    await readDepartments();
    await createDepartment();
    await updateDepartment();
    await deleteDepartment();
    console.log('---------Basic operations performed---------');
}

// CRUD operations for Department model
async function readDepartments() {
    const departments = await Department.find();
    console.log('Departments:', departments);
}

async function createDepartment() {
    const newDepartment = await Department.create({ departmentName: 'New Department', floor: 4, officeNumber: 401, nameOfTheManager: 'Manager Name' });
    console.log('New department:', newDepartment);
}

async function updateDepartment() {
    const result = await Department.updateOne({ departmentName: 'New Department' }, { officeNumber: 402 });
    console.log('Updated department:', result);
}

async function deleteDepartment() {
    const result = await Department.deleteOne({ departmentName: 'New Department' });
    console.log('Deleted department:', result);
}
