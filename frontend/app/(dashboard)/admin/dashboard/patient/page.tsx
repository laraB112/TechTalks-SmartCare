import { patients } from "../../components/patient";
import PatientsPage from "../../components/Patients";



export default function DashboardPatientPage(){
    return(
           <>
           <PatientsPage patients={patients}/>
           </>
    );
}