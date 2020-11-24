import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, TextInput, TouchableOpacity, ScrollView
} from 'react-native';

import { database } from "../../storage/Database";
import { uuid } from 'uuidv4';
import styles from '../Style';
import { EventTypes } from '../../enums/EventTypes';
import LinearGradient from 'react-native-linear-gradient';
import { datePicker, radioButtons } from '../Covid19Form'
import { LocalizedStrings } from '../../enums/LocalizedStrings';

export const MedicalPathologiesDisplay = (metadataObj, language) => {
    return (
        <View>

        </View>)
}

const MedicalPathologies = (props) => {
    const [miscarriages, setMiscarriages] = useState(false);
    const [miscarriagesNumber, setMiscarriagesNumber] = useState(null);
    const [foodAllergies, setFoodAllergies] = useState(false);
    const [foodAllergiesText, setFoodAllergiesText] = useState(null);
    const [animalAllergies, setAnimalAllergies] = useState(false);
    const [animalAllergiesText, setAnimalAllergiesText] = useState(null);
    const [atmosphereAllergies, setAtmosphereAllergies] = useState(false);
    const [atmosphereAllergiesText, setAtmosphereAllergiesText] = useState(null);
    const [insectAllergies, setInsectAllergies] = useState(false);
    const [insectAllergiesText, setInsectAllergiesText] = useState(null);
    const [latexAllergies, setLatexAllergies] = useState(false);
    const [latexAllergiesText, setLatexAllergiesText] = useState(null);
    const [medicineAllergies, setMedicineAllergies] = useState(false);
    const [medicineAllergiesText, setMedicineAllergiesText] = useState(null);
    const [otherAllergies, setOtherAllergies] = useState(false);
    const [otherAllergiesText, setOtherAllergiesText] = useState(null);
    const [tonsillitis, setTonsillitis] = useState(false);
    const [tonsillitisText, setTonsillitisText] = useState(null);
    const [anemic, setAnemic] = useState(false);
    const [anemicText, setAnemicText] = useState(null);
    const [arthritis, setArthritis] = useState(false);
    const [arthritisText, setArthritisText] = useState(null);
    const [asthma, setAsthma] = useState(false);
    const [asthmaText, setAsthmaText] = useState(null);
    const [neckPain, setNeckPain] = useState(false);
    const [neckPainText, setNeckPainText] = useState(null);
    const [cervicovaginitis, setCervicovaginitis] = useState(false);
    const [cervicovaginitisText, setCervicovaginitisText] = useState(null);

    const [cSection, setCSection] = useState(null);

    const [sciaticPain, setSciaticPain] = useState(false);
    const [sciaticPainText, setSciaticPainText] = useState(null);
    const [cholesterol, setCholesterol] = useState(false);
    const [cholesterolText, setCholesterolText] = useState(null);
    const [infantColic, setInfantColic] = useState(false);
    const [infantColicText, setInfantColicText] = useState(null);
    const [conjunctivitis, setConjunctivitis] = useState(false);
    const [conjunctivitisText, setConjunctivitisText] = useState(null);
    const [covid, setCovid] = useState(false);
    const [covidText, setCovidText] = useState(null);
    const [malnourishment, setMalnourishment] = useState(false);
    const [malnourishmentText, setMalnourishmentText] = useState(null);
    const [migraines, setMigraines] = useState(false);
    const [migrainesText, setMigrainesText] = useState(null);
    const [diarrhea, setDiarrhea] = useState(false);
    const [diarrheaText, setDiarrheaText] = useState(null);
    const [ecocardiogram, setEcocardiogram] = useState(false);
    const [ecocardiogramText, setEcocardiogramText] = useState(null);
    const [elecrocardiogram, setElecrocardiogram] = useState(false);
    const [elecrocardiogramText, setElecrocardiogramText] = useState(null);

    const [pregnant, setPregnant] = useState(false);
    const [pregnancies, setPregnancies] = useState(null);

    const [chikungunya, setChikungunya] = useState(false);
    const [chikungunyaText, setChikungunyaText] = useState(null);
    const [dengue, setDengue] = useState(false);
    const [dengueText, setDengueText] = useState(null);
    const [malaria, setMalaria] = useState(false);
    const [malariaText, setMalariaText] = useState(null);
    const [otherMosquito, setOtherMosquito] = useState(false);
    const [otherMosquitoText, setOtherMosquitoText] = useState(null);
    const [zika, setZika] = useState(false);
    const [zikaText, setZikaText] = useState(null);
    const [copd, setCopd] = useState(false);
    const [copdText, setCopdText] = useState(null);
    const [gastritis, setGastritis] = useState(false);
    const [gastritisText, setGastritisText] = useState(null);
    const [scabies, setScabies] = useState(false);
    const [scabiesText, setScabiesText] = useState(null);

    const [lastPAP, setLastPAP] = useState('');

    const [vaginalFluid, setVaginalFluid] = useState(false);
    const [vaginalFluidText, setVaginalFluidText] = useState(null);
    const [hypertension, setHypertension] = useState(false);
    const [hypertensionText, setHypertensionText] = useState(null);
    const [hypothyroidism, setHypothyroidism] = useState(false);
    const [hypothyroidismText, setHypothyroidismText] = useState(null);
    const [bacterialResp, setBacterialResp] = useState(false);
    const [bacterialRespText, setBacterialRespText] = useState(null);
    const [viralResp, setViralResp] = useState(false);
    const [viralRespText, setViralRespText] = useState(null);
    const [uti, setUti] = useState(false);
    const [utiText, setUtiText] = useState(null);
    const [renalFailure, setRenalFailure] = useState(false);
    const [renalFailureText, setRenalFailureText] = useState(null);
    const [breastfeeding, setBreastfeeding] = useState(false);
    const [breastfeedingText, setBreastfeedingText] = useState(null);
    const [lumbago, setLumbago] = useState(false);
    const [lumbagoText, setLumbagoText] = useState(null);
    const [menopause, setMenopause] = useState(false);
    const [menopauseText, setMenopauseText] = useState(null);
    const [nausea, setNausea] = useState(false);
    const [nauseaText, setNauseaText] = useState(null);
    const [nephrolithiasisRenal, setNephrolithiasisRenal] = useState(false);
    const [nephrolithiasisRenalText, setNephrolithiasisRenalText] = useState(null);
    const [diabeticNeuropathy, setDiabeticNeuropathy] = useState(false);
    const [diabeticNeuropathyText, setDiabeticNeuropathyText] = useState(null);
    const [obesity, setObesity] = useState(false);
    const [obesityText, setObesityText] = useState(null);
    const [osteoarthritis, setOsteoarthritis] = useState(false);
    const [osteoarthritisText, setOsteoarthritisText] = useState(null);
    const [otitis, setOtitis] = useState(false);
    const [otitisText, setOtitisText] = useState(null);
    const [paralysis, setParalysis] = useState(false);
    const [paralysisText, setParalysisText] = useState(null);
    const [parasites, setParasites] = useState(false);
    const [parasitesText, setParasitesText] = useState(null);
    const [skinHealthy, setSkinHealthy] = useState(false);
    const [skinHealthyText, setSkinHealthyText] = useState(null);
    const [skinUlcers, setSkinUlcers] = useState(false);
    const [skinUlcersText, setSkinUlcersText] = useState(null);
    const [skinInfected, setSkinInfected] = useState(false);
    const [skinInfectedText, setSkinInfectedText] = useState(null);
    const [lice, setLice] = useState(false);
    const [liceText, setLiceText] = useState(null);

    const [postnatalVisit, setPostnatalVisit] = useState(false);
    const [prenatalVisit, setPrenatalVisit] = useState(false);

    const [eyeProb, setEyeProb] = useState(false);
    const [eyeProbText, setEyeProbText] = useState(null);
    const [emotionalProb, setEmotionalProb] = useState(false);
    const [emotionalProbText, setEmotionalProbText] = useState(null);
    const [gynecologicalProb, setGynecologicalProb] = useState(false);
    const [gynecologicalProbText, setGynecologicalProbText] = useState(null);
    const [parkinsons, setParkinsons] = useState(false);
    const [parkinsonsText, setParkinsonsText] = useState(null);
    const [epilepsy, setEpilepsy] = useState(false);
    const [epilepsyText, setEpilepsyText] = useState(null);
    const [neurologicalProb, setNeurologicalProb] = useState(false);
    const [neurologicalProbText, setNeurologicalProbText] = useState(null);
    const [therapistReferred, setTherapistReferred] = useState(false);
    const [therapistReferredText, setTherapistReferredText] = useState(null);
    const [developmentallyDelayed, setDevelopmentallyDelayed] = useState(false);
    const [developmentallyDelayedText, setDevelopmentallyDelayedText] = useState(null);
    const [vitamins, setVitamins] = useState(false);
    const [vitaminsText, setVitaminsText] = useState(null);

    const [lastMenstruation, setLastMenstruation] = useState('');

    const [hiv, setHiv] = useState(false);
    const [hivText, setHivText] = useState(null);
    const [vomiting, setVomiting] = useState(false);
    const [vomitingText, setVomitingText] = useState(null);
    const [other, setOther] = useState(null);


    const patientId = props.navigation.getParam('patientId');
    const visitId = props.navigation.getParam('visitId');
    const language = props.navigation.getParam('language', 'en');

    const submit = async () => {
        database.addEvent({
            id: uuid(),
            patient_id: patientId,
            visit_id: visitId,
            event_type: EventTypes.MedicalPathologies,
            event_metadata: JSON.stringify({
                miscarriages,
                miscarriagesNumber,
                foodAllergies,
                foodAllergiesText,
                animalAllergies,
                animalAllergiesText,
                atmosphereAllergies,
                atmosphereAllergiesText,
                insectAllergies,
                insectAllergiesText,
                latexAllergies,
                latexAllergiesText,
                medicineAllergies,
                medicineAllergiesText,
                otherAllergies,
                otherAllergiesText,
                tonsillitis,
                tonsillitisText,
                anemic,
                anemicText,
                arthritis,
                arthritisText,
                asthma,
                asthmaText,
                neckPain,
                neckPainText,
                cervicovaginitis,
                cervicovaginitisText,
                cSection,
                sciaticPain,
                sciaticPainText,
                cholesterol,
                cholesterolText,
                infantColic,
                infantColicText,
                conjunctivitis,
                conjunctivitisText,
                covid,
                covidText,
                malnourishment,
                malnourishmentText,
                migraines,
                migrainesText,
                diarrhea,
                diarrheaText,
                ecocardiogram,
                ecocardiogramText,
                elecrocardiogram,
                elecrocardiogramText,
                pregnant,
                pregnancies,
                chikungunya,
                chikungunyaText,
                dengue,
                dengueText,
                malaria,
                malariaText,
                otherMosquito,
                otherMosquitoText,
                zika,
                zikaText,
                copd,
                copdText,
                gastritis,
                gastritisText,
                scabies,
                scabiesText,
                lastPAP,
                vaginalFluid,
                vaginalFluidText,
                hypertension,
                hypertensionText,
                hypothyroidism,
                hypothyroidismText,
                bacterialResp,
                bacterialRespText,
                viralResp,
                viralRespText,
                uti,
                utiText,
                renalFailure,
                renalFailureText,
                breastfeeding,
                breastfeedingText,
                lumbago,
                lumbagoText,
                menopause,
                menopauseText,
                nausea,
                nauseaText,
                nephrolithiasisRenal,
                nephrolithiasisRenalText,
                diabeticNeuropathy,
                diabeticNeuropathyText,
                obesity,
                obesityText,
                osteoarthritis,
                osteoarthritisText,
                otitis,
                otitisText,
                paralysis,
                paralysisText,
                parasites,
                parasitesText,
                skinHealthy,
                skinHealthyText,
                skinUlcers,
                skinUlcersText,
                skinInfected,
                skinInfectedText,
                lice,
                liceText,
                postnatalVisit,
                prenatalVisit,
                eyeProb,
                eyeProbText,
                emotionalProb,
                emotionalProbText,
                gynecologicalProb,
                gynecologicalProbText,
                parkinsons,
                parkinsonsText,
                epilepsy,
                epilepsyText,
                neurologicalProb,
                neurologicalProbText,
                therapistReferred,
                therapistReferredText,
                developmentallyDelayed,
                developmentallyDelayedText,
                vitamins,
                vitaminsText,
                lastMenstruation,
                hiv,
                hivText,
                vomiting,
                vomitingText,
                other,
            })
        }).then(() => {
            props.navigation.navigate('NewVisit')
        })
    };

    const formRow = (field, action, textField, textAction, prompt) => {

        return (
            <View style={[styles.responseRow, { padding: 0 }]}>
                <View style={[styles.responseRow]}>
                    {radioButtons({ field, action, prompt: LocalizedStrings[language][prompt], language })}
                </View>
                {field ?
                    <View style={[styles.responseRow, { padding: 0 }]}>
                        <TextInput
                            placeholder={LocalizedStrings[language].details}
                            style={styles.inputs}
                            onChangeText={(text) => textAction(text)}
                            value={textField}
                        />
                    </View> : null}
            </View>)

    }

    return (
        <ScrollView>
            <LinearGradient colors={['#31BBF3', '#4D7FFF']} style={styles.containerLeft}>
                <View style={[styles.inputsContainer, { alignItems: 'flex-start' }]}>

                    <View style={[styles.responseRow]}>
                        {radioButtons({ field: miscarriages, action: setMiscarriages, prompt: LocalizedStrings[language].miscarriages, language })}
                    </View>
                    {miscarriages ?
                        <View style={[styles.responseRow, { padding: 0 }]}>
                            <TextInput
                                style={styles.inputs}
                                onChangeText={(text) => setMiscarriagesNumber(text)}
                                value={miscarriagesNumber}
                                keyboardType='numeric'
                            />
                        </View> : null
                    }
                    {formRow(foodAllergies, setFoodAllergies, foodAllergiesText, setFoodAllergiesText, 'foodAllergies')}
                    {formRow(animalAllergies, setAnimalAllergies, animalAllergiesText, setAnimalAllergiesText, 'animalAllergies')}
                    {formRow(atmosphereAllergies, setAtmosphereAllergies, atmosphereAllergiesText, setAtmosphereAllergiesText, 'atmosphereAllergies')}
                    {formRow(insectAllergies, setInsectAllergies, insectAllergiesText, setInsectAllergiesText, 'insectAllergies')}
                    {formRow(latexAllergies, setLatexAllergies, latexAllergiesText, setLatexAllergiesText, 'latexAllergies')}
                    {formRow(medicineAllergies, setMedicineAllergies, medicineAllergiesText, setMedicineAllergiesText, 'medicineAllergies')}
                    {formRow(otherAllergies, setOtherAllergies, otherAllergiesText, setOtherAllergiesText, 'otherAllergies')}
                    {formRow(tonsillitis, setTonsillitis, tonsillitisText, setTonsillitisText, 'tonsillitis')}
                    {formRow(anemic, setAnemic, anemicText, setAnemicText, 'anemic')}
                    {formRow(arthritis, setArthritis, arthritisText, setArthritisText, 'arthritis')}
                    {formRow(asthma, setAsthma, asthmaText, setAsthmaText, 'asthma')}
                    {formRow(neckPain, setNeckPain, neckPainText, setNeckPainText, 'neckPain')}
                    {formRow(cervicovaginitis, setCervicovaginitis, cervicovaginitisText, setCervicovaginitisText, 'cervicovaginitis')}
                    <View style={[styles.responseRow, { paddingBottom: 0 }]}>
                        <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].cSection}</Text>
                    </View>

                    <View style={[styles.responseRow, { padding: 0 }]}>
                        <TextInput
                            style={styles.inputs}
                            onChangeText={(text) => setCSection(text)}
                            value={cSection}
                            keyboardType='numeric'
                        />
                    </View>
                    {formRow(sciaticPain, setSciaticPain, sciaticPainText, setSciaticPainText, 'sciaticPain')}
                    {formRow(cholesterol, setCholesterol, cholesterolText, setCholesterolText, 'cholesterol')}
                    {formRow(infantColic, setInfantColic, infantColicText, setInfantColicText, 'infantColic')}
                    {formRow(conjunctivitis, setConjunctivitis, conjunctivitisText, setConjunctivitisText, 'conjunctivitis')}
                    {formRow(covid, setCovid, covidText, setCovidText, 'covid')}
                    {formRow(malnourishment, setMalnourishment, malnourishmentText, setMalnourishmentText, 'malnourishment')}
                    {formRow(migraines, setMigraines, migrainesText, setMigrainesText, 'migraines')}
                    {formRow(diarrhea, setDiarrhea, diarrheaText, setDiarrheaText, 'diarrhea')}
                    {formRow(ecocardiogram, setEcocardiogram, ecocardiogramText, setEcocardiogramText, 'ecocardiogram')}
                    {formRow(elecrocardiogram, setElecrocardiogram, elecrocardiogramText, setElecrocardiogramText, 'elecrocardiogram')}
                    <View style={[styles.responseRow]}>
                        {radioButtons({ field: pregnant, action: setPregnant, prompt: LocalizedStrings[language].pregnant, language })}
                    </View>
                    <View style={[styles.responseRow, { paddingBottom: 0 }]}>
                        <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].pregnancies}</Text>
                    </View>
                    <View style={[styles.responseRow, { padding: 0 }]}>
                        <TextInput
                            style={styles.inputs}
                            onChangeText={(text) => setPregnancies(text)}
                            value={pregnancies}
                            keyboardType='numeric'
                        />
                    </View>
                    {formRow(chikungunya, setChikungunya, chikungunyaText, setChikungunyaText, 'chikungunya')}
                    {formRow(dengue, setDengue, dengueText, setDengueText, 'dengue')}
                    {formRow(malaria, setMalaria, malariaText, setMalariaText, 'malaria')}
                    {formRow(otherMosquito, setOtherMosquito, otherMosquitoText, setOtherMosquitoText, 'otherMosquito')}
                    {formRow(zika, setZika, zikaText, setZikaText, 'zika')}
                    {formRow(copd, setCopd, copdText, setCopdText, 'copd')}
                    {formRow(gastritis, setGastritis, gastritisText, setGastritisText, 'gastritis')}
                    {formRow(scabies, setScabies, scabiesText, setScabiesText, 'scabies')}
                    <View style={[styles.responseRow, { paddingVertical: 0 }]}>
                        <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].lastPAP}</Text>
                    </View>
                    <View style={{ paddingLeft: 20 }}>{datePicker({ placeholder: ' Date', date: lastPAP, action: setLastPAP, language })}</View>
                    {formRow(vaginalFluid, setVaginalFluid, vaginalFluidText, setVaginalFluidText, 'vaginalFluid')}
                    {formRow(hypertension, setHypertension, hypertensionText, setHypertensionText, 'hypertension')}
                    {formRow(hypothyroidism, setHypothyroidism, hypothyroidismText, setHypothyroidismText, 'hypothyroidism')}
                    {formRow(bacterialResp, setBacterialResp, bacterialRespText, setBacterialRespText, 'bacterialResp')}
                    {formRow(viralResp, setViralResp, viralRespText, setViralRespText, 'viralResp')}
                    {formRow(uti, setUti, utiText, setUtiText, 'uti')}
                    {formRow(renalFailure, setRenalFailure, renalFailureText, setRenalFailureText, 'renalFailure')}
                    {formRow(breastfeeding, setBreastfeeding, breastfeedingText, setBreastfeedingText, 'breastfeeding')}
                    {formRow(lumbago, setLumbago, lumbagoText, setLumbagoText, 'lumbago')}
                    {formRow(menopause, setMenopause, menopauseText, setMenopauseText, 'menopause')}
                    {formRow(nausea, setNausea, nauseaText, setNauseaText, 'nausea')}
                    {formRow(nephrolithiasisRenal, setNephrolithiasisRenal, nephrolithiasisRenalText, setNephrolithiasisRenalText, 'nephrolithiasisRenal')}
                    {formRow(diabeticNeuropathy, setDiabeticNeuropathy, diabeticNeuropathyText, setDiabeticNeuropathyText, 'diabeticNeuropathy')}
                    {formRow(obesity, setObesity, obesityText, setObesityText, 'obesity')}
                    {formRow(osteoarthritis, setOsteoarthritis, osteoarthritisText, setOsteoarthritisText, 'osteoarthritis')}
                    {formRow(otitis, setOtitis, otitisText, setOtitisText, 'otitis')}
                    {formRow(paralysis, setParalysis, paralysisText, setParalysisText, 'paralysis')}
                    {formRow(parasites, setParasites, parasitesText, setParasitesText, 'parasites')}
                    {formRow(skinHealthy, setSkinHealthy, skinHealthyText, setSkinHealthyText, 'skinHealthy')}
                    {formRow(skinUlcers, setSkinUlcers, skinUlcersText, setSkinUlcersText, 'skinUlcers')}
                    {formRow(skinInfected, setSkinInfected, skinInfectedText, setSkinInfectedText, 'skinInfected')}
                    {formRow(lice, setLice, liceText, setLiceText, 'lice')}
                    <View style={[styles.responseRow]}>
                        {radioButtons({ field: postnatalVisit, action: setPostnatalVisit, prompt: LocalizedStrings[language].postnatalVisit, language })}
                    </View>
                    <View style={[styles.responseRow]}>
                        {radioButtons({ field: prenatalVisit, action: setPrenatalVisit, prompt: LocalizedStrings[language].prenatalVisit, language })}
                    </View>
                    {formRow(eyeProb, setEyeProb, eyeProbText, setEyeProbText, 'eyeProb')}
                    {formRow(emotionalProb, setEmotionalProb, emotionalProbText, setEmotionalProbText, 'emotionalProb')}
                    {formRow(gynecologicalProb, setGynecologicalProb, gynecologicalProbText, setGynecologicalProbText, 'gynecologicalProb')}
                    {formRow(parkinsons, setParkinsons, parkinsonsText, setParkinsonsText, 'parkinsons')}
                    {formRow(epilepsy, setEpilepsy, epilepsyText, setEpilepsyText, 'epilepsy')}
                    {formRow(neurologicalProb, setNeurologicalProb, neurologicalProbText, setNeurologicalProbText, 'neurologicalProb')}
                    {formRow(therapistReferred, setTherapistReferred, therapistReferredText, setTherapistReferredText, 'therapistReferred')}
                    {formRow(developmentallyDelayed, setDevelopmentallyDelayed, developmentallyDelayedText, setDevelopmentallyDelayedText, 'developmentallyDelayed')}
                    {formRow(vitamins, setVitamins, vitaminsText, setVitaminsText, 'vitamins')}
                    <View style={[styles.responseRow, { paddingVertical: 0 }]}>
                        <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].lastMenstruation}</Text>
                    </View>
                    <View style={{ paddingLeft: 20 }}>{datePicker({ placeholder: ' Date', date: lastMenstruation, action: setLastMenstruation, language })}</View>
                    {formRow(hiv, setHiv, hivText, setHivText, 'hiv')}
                    {formRow(vomiting, setVomiting, vomitingText, setVomitingText, 'vomiting')}
                    <View style={[styles.responseRow, { paddingBottom: 0 }]}>
                        <Text style={{ color: '#FFFFFF' }}>{LocalizedStrings[language].other}</Text>
                    </View>
                    <View style={[styles.responseRow, { padding: 0 }]}>
                        <TextInput
                            style={styles.inputs}
                            onChangeText={(text) => setOther(text)}
                            value={other}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => submit()}>
                        <Image source={require('../../images/login.png')} style={{ width: 75, height: 75 }} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </ScrollView>
    );
};

export default MedicalPathologies;
