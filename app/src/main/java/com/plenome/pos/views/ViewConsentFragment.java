package com.plenome.pos.views;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.core.content.res.ResourcesCompat;
import androidx.fragment.app.Fragment;

import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;

import org.hl7.fhir.r4.model.CodeableConcept;
import org.hl7.fhir.r4.model.Coding;
import org.hl7.fhir.r4.model.Composition;
import org.hl7.fhir.r4.model.DocumentReference;
import org.hl7.fhir.r4.model.Dosage;
import org.hl7.fhir.r4.model.Encounter;
import org.hl7.fhir.r4.model.HumanName;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Medication;
import org.hl7.fhir.r4.model.MedicationRequest;
import org.hl7.fhir.r4.model.Observation;
import org.hl7.fhir.r4.model.Organization;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.Practitioner;
import org.hl7.fhir.r4.model.Quantity;
import org.hl7.fhir.r4.model.Reference;
import org.hl7.fhir.r4.model.Resource;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

import butterknife.BindView;
import butterknife.ButterKnife;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.IParser;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ViewConsentFragment extends Fragment{
    View rootView;
    RestServices abhaServices;

    @BindView(R.id.fhir_container)
    LinearLayout fhirContainer;

    @BindView(R.id.requst_no)
    TextView requstNo;

    @BindView(R.id.grante_on)
    TextView granteOn;
    @BindView(R.id.expire_on)
    TextView expireOn;

    @BindView(R.id.duration_count)
    TextView durationCount;

    @BindView(R.id.duration_period)
    TextView durationPeriod;

    @BindView(R.id.abha_address)
    TextView abhaAddress;

    @BindView(R.id.abha_number)
    TextView abhaNumber;

    @BindView(R.id.spinSelect)
    Spinner spinSelect;

    @BindView(R.id.loader)
    LinearLayout loader;


    private String artifactsId, requestOn, grantedOn, expiryDate, start, end, abhaAdd, abhanum;

    ArrayList<String> retrievedIds;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.dialog_fhir_details, container, false);
        ButterKnife.bind(this, rootView);
        OPHubApplication.appBarTitle.setText("View Consent");
        abhaServices = RetrofitInstance.createAbhaService(RestServices.class);

        Bundle bundle = getArguments();
        if (bundle != null) {
            retrievedIds = bundle.getStringArrayList("artifactIdsList");
            artifactsId = bundle.getString("artifactsId");
            requestOn = bundle.getString("requested");
            grantedOn = bundle.getString("granted");
            expiryDate = bundle.getString("expireDate");
            start = bundle.getString("start");
            end = bundle.getString("end");
            abhaAdd = bundle.getString("abhaAddress");
            abhanum = bundle.getString("abhaNumber");
            System.out.println("print artifact list " + retrievedIds);

//            viewConsentReq(artifactsId);
            requstNo.setText(requestOn);
            granteOn.setText(grantedOn);
            expireOn.setText(expiryDate);
            durationPeriod.setText(start + " TO " + end);
            durationCount.setText("-");
            abhaAddress.setText(abhaAdd);
            abhaNumber.setText(abhanum);
        }
        System.out.println("print inside");
        loader.setVisibility(View.VISIBLE);
        fhirContainer.setVisibility(View.GONE);


        ArrayAdapter<String> adapter = new ArrayAdapter<>(getActivity(), android.R.layout.simple_spinner_item, retrievedIds);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinSelect.setAdapter(adapter);


        spinSelect.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                String selectedItem = parentView.getItemAtPosition(position).toString();
                loader.setVisibility(View.VISIBLE);
                fhirContainer.setVisibility(View.GONE);
                viewConsentReq(selectedItem);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {
            }
        });

        return rootView;

    }


    private void viewConsentReq(String consentArtefactId) {
        Log.i("myLog", "viewConsentReq");
        OPHubRequests.ViewConsentReq request = new OPHubRequests.ViewConsentReq();
        request.setConsentArtefactId(consentArtefactId);
        Log.i("myLog", "viewConsentReq request : " + new Gson().toJson(request));
        Call<ResponseBody> call = abhaServices.viewConsentReq(request);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {

                try {
                    if (response.body() != null) {
                        fhirContainer.removeAllViews();
                        Log.i("myLog", "server contacted and has file");
                        //    Log.i("myLog", "viewConsentReq response : " + new Gson().toJson(response));
                        try {
                            byte[] bytes = response.body().bytes();
                            Log.i("myLog", "byte  length:" + bytes.length);
                            String base64 = new String(bytes, StandardCharsets.UTF_8);
                            base64ToFile(base64, "Document.txt");
                            Log.i("myLog", "after image set");
                        } catch (IOException e) {
    //                        throw new RuntimeException(e);
                        }

                    } else {
                        Log.i("myLog", "server contact failed");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "downloadAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    public void base64ToFile(String base64String, String fileName) {
        try {

            try {
                byte[]  decodedBytes = Base64.decode(base64String, Base64.DEFAULT);
            } catch (IllegalArgumentException e) {
                Toast.makeText(getContext(), "Invalid Data", Toast.LENGTH_SHORT).show();
                loader.setVisibility(View.GONE);
                fhirContainer.setVisibility(View.GONE);
                return; // Stop execution if invalid
            }
            // Decode the Base64 string
            byte[] decodedBytes = Base64.decode(base64String, Base64.DEFAULT);

            // Define the path where the file will be saved
            File file = new File(getContext().getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), fileName);

            // Write the decoded bytes to a file
            FileOutputStream fos = new FileOutputStream(file);
            fos.write(decodedBytes);
            fos.close();

            System.out.println("File saved: " + file.getAbsolutePath());
            JSONObject jsonObject = fileToJson(fileName);
            if (jsonObject != null) {
                Log.i("myLog", jsonObject.toString());
                Log.i("myLog", "File name : " + jsonObject.getString("entries"));

                // Inflate the custom layout for the dialog
//                LayoutInflater inflater = getLayoutInflater();
//                View dialogView = inflater.inflate(R.layout.dialog_fhir_details, null);
//
//                // Find the container where we'll dynamically add data
//                ImageView closeIcon = dialogView.findViewById(R.id.close_icon);
//                LinearLayout fhirContainer = dialogView.findViewById(R.id.fhir_container);
//

                int length = jsonObject.getJSONArray("entries").length();
                for (int start = 0; start < length; start++) {
                    parseFhirBundleAndPopulateUI(jsonObject.getJSONArray("entries").getJSONObject(start).getString("content"), fhirContainer);
                }
                loader.setVisibility(View.GONE);
                fhirContainer.setVisibility(View.VISIBLE);
                // Parse FHIR bundle and populate UI

                // Create the AlertDialog
//                AlertDialog dialog = new AlertDialog.Builder(getContext())
//                        .setView(dialogView)
//                        .create();
//
//                // Position the dialog in the right corner of the screen
//                Window window = dialog.getWindow();
//                if (window != null) {
//                    WindowManager.LayoutParams layoutParams = window.getAttributes();
//                    layoutParams.x = 20;  // Adjust X-position (optional, tweak for desired margin)
//                    layoutParams.y = 100; // Adjust Y-position (optional, tweak for desired margin)
//                    layoutParams.dimAmount = 0.3f; // Set dim effect when dialog is displayed
//                    window.setAttributes(layoutParams);
//
//                }
//                dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
//                dialog.getWindow().setLayout(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.MATCH_PARENT);
//
//                // Handle the close button click
//                closeIcon.setOnClickListener(v -> dialog.dismiss());
//
//                // Show the dialog
//                dialog.show();

            }
        } catch (IOException e) {
//            e.printStackTrace();
        } catch (JSONException e) {
//            throw new RuntimeException(e);
        }
    }

    public JSONObject fileToJson(String fileName) {
        File file = new File(getContext().getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), fileName);
        StringBuilder jsonString = new StringBuilder();

        try {
            BufferedReader br = new BufferedReader(new FileReader(file));
            String line;
            while ((line = br.readLine()) != null) {
                jsonString.append(line);
            }
            br.close();

            // Convert the file content to JSON object
            return new JSONObject(jsonString.toString());

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    private void parseFhirBundleAndPopulateUI(String jsonBundle, LinearLayout fhirContainer) {
        // Initialize FHIR context

        try {
            FhirContext fhirContext = FhirContext.forR4();
            IParser parser = fhirContext.newJsonParser();

            // Parse the bundle
            org.hl7.fhir.r4.model.Bundle bundle = parser.parseResource(org.hl7.fhir.r4.model.Bundle.class, jsonBundle);

            // Iterate over the entries in the bundle
            for (org.hl7.fhir.r4.model.Bundle.BundleEntryComponent entry : bundle.getEntry()) {
                Resource resource = entry.getResource();
                String resourceType = resource.getResourceType().toString();

                View emptyView = new View(getContext());
                emptyView.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(30)));
                fhirContainer.addView(emptyView);


                if(!(resource instanceof Composition)) {
                    // Create a TextView for the resource type
                    TextView resourceTitle = new TextView(getContext());
                    resourceTitle.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(45)));
                    resourceTitle.setText(resourceType);
                    Typeface typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal); // custom_font.ttf in res/font
                    resourceTitle.setTypeface(typeface);
                    resourceTitle.setTextSize(18);
                    resourceTitle.setTypeface(typeface, Typeface.BOLD);
                    resourceTitle.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
                    resourceTitle.setGravity(Gravity.CENTER_VERTICAL);
//            resourceTitle.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue)); // Custom color from colors.xml
                    fhirContainer.addView(resourceTitle);
                }


                // Extract and display resource details based on type
                if (resource instanceof Patient) {
                    Patient patient = (Patient) resource;
                    displayPatientData(patient, fhirContainer);  // Display the Patient data
                } else if (resource instanceof Observation) {
                    Observation observation = (Observation) resource;
                    displayObservationData(observation, fhirContainer);  // Display the Observation data
                } else if (resource instanceof Encounter) {
                    Encounter encounter = (Encounter) resource;
                    displayEncounterData(encounter, fhirContainer);  // Display the Encounter data
                } else if (resource instanceof Composition) {
                    Composition composition = (Composition) resource;
                    displayCompositionData(composition, fhirContainer);  // Display the Composition data.
                } else if (resource instanceof Practitioner) {
                    Practitioner practitioner = (Practitioner) resource;
                    displayPractitionerData(practitioner, fhirContainer);  // Display the Practitioner data
                } else if (resource instanceof Organization) {
                    Organization organization = (Organization) resource;
                    displayOrganizationData(organization, fhirContainer);  // Display the Organization data
                } else if (resource instanceof MedicationRequest) {
                    MedicationRequest medicationRequest = (MedicationRequest) resource;
                    displayMedicationRequestData(medicationRequest, fhirContainer);  // Display the MedicationRequest data
                } else if (resource instanceof Medication) {
                    Medication medication = (Medication) resource;
                    displayMedicationData(medication, fhirContainer);  // Display the Medication data
                } else if (resource instanceof DocumentReference) {
                    DocumentReference documentReference = (DocumentReference) resource;
                    displayDocumentReferenceData(documentReference, fhirContainer);  // Display the DocumentReference data
                } else {
                    addTextView(fhirContainer, "Other Resource: " + resourceType + " (Details not displayed)");
                }
            }
        }catch (Exception e){
            Toast.makeText(getContext(), "Invalid Data", Toast.LENGTH_SHORT).show();
            System.out.println("print exception " + e);
        }

    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }

    // Method to display DocumentReference details in the layout
    private void displayDocumentReferenceData(DocumentReference documentReference, LinearLayout layout) {
        // Create TextView for the document status
        if (documentReference.hasStatus()) {
            addTextView(layout, "Document Status: " + documentReference.getStatus().toString());
        }

        // Create TextView for the document type
        if (documentReference.hasType()) {
            String type = documentReference.getType().getCodingFirstRep().getDisplay();
            addTextView(layout, "Document Type: " + type);
        }

        // Create TextView for the subject of the document reference (patient)
        if (documentReference.hasSubject()) {
            Reference subjectReference = documentReference.getSubject();
            String subjectRef = subjectReference.getReference();
            addTextView(layout, "Document Subject: " + subjectRef);
        }

        // Create TextView for the date of the document
        if (documentReference.hasDate()) {
            addTextView(layout, "Document Date: " + documentReference.getDate().toString());
        }

        // Create TextView for the author(s) of the document
        if (documentReference.hasAuthor()) {
            documentReference.getAuthor().forEach(author -> {
                String authorRef = author.getReference();
                addTextView(layout, "Document Author: " + authorRef);
            });
        }

        // Create TextView for the content reference
        if (documentReference.hasContent()) {
            documentReference.getContent().forEach(content -> {
                String data = content.getAttachment().getData().toString();
                if (data != null || !data.isEmpty()) {
                    addDownloadTextView(layout, "View Document: " + content.getAttachment().getTitle(),
                            content.getAttachment().getData(), content.getAttachment().getTitle());
                }
            });
        }
    }


    // Method to display Patient details in the layout
    private void displayPatientData(Patient patient, LinearLayout layout) {
        // Create TextView for the patient's name
        if (patient.hasName()) {
            for (HumanName name : patient.getName()) {
                if (name.hasText()) {
                    String fullName = name.getText().toString();/* + " " + name.getFamily();*/
                    addTextView(layout, "Patient Name: " + fullName);
                }
            }
        }

        // Create TextView for the patient's identifier
        if (patient.hasIdentifier()) {
            for (Identifier identifier : patient.getIdentifier()) {
                String idValue = identifier.getValue();
                String idSystem = identifier.getSystem();
                addTextView(layout, "Patient Identifier: " + idValue + " (System: " + idSystem + ")");
            }
        }

        // Create TextView for the patient's gender
        if (patient.hasGender()) {
            addTextView(layout, "Patient Gender: " + patient.getGender().toString());
        }

        // Create TextView for the patient's birth date
        if (patient.hasBirthDate()) {
            addTextView(layout, "Patient Birth Date: " + patient.getBirthDate().toString());
        }

        // Add additional patient details as necessary
        if (patient.hasAddress()) {
            patient.getAddress().forEach(address -> {
                String addressText = address.getText();
                addTextView(layout, "Patient Address: " + addressText);
            });
        }
    }


    // Method to display Observation details in the layout
    private void displayObservationData(Observation observation, LinearLayout layout) {
        // Create a TextView for the observation code
        if (observation.hasCode()) {
            CodeableConcept code = observation.getCode();
            String observationCode = code.getCodingFirstRep().getDisplay();
            addTextView(layout, "Observation Code: " + observationCode);
        }

        // Create a TextView for the observation status
        if (observation.hasStatus()) {
            addTextView(layout, "Observation Status: " + observation.getStatus().toString());
        }

        // Create a TextView for the observation value
        if (observation.hasValueQuantity()) {
            Quantity value = observation.getValueQuantity();
            String valueText = value.getValue() + " " + value.getUnit();
            addTextView(layout, "Observation Value: " + valueText);
        }

        // Create a TextView for the subject of the observation (patient)
        if (observation.hasSubject()) {
            String patientReference = observation.getSubject().getReference();
            addTextView(layout, "Patient Reference: " + patientReference);
        }

        // Add additional observation details as necessary
        addTextView(layout, "Observation Date: " + observation.getEffectiveDateTimeType().getValueAsString());
    }

    // Method to display Encounter details in the layout
    private void displayEncounterData(Encounter encounter, LinearLayout layout) {
        // Create a TextView for the encounter status
        if (encounter.hasStatus()) {
            addTextView(layout, "Encounter Status: " + encounter.getStatus().toString());
        }

        // Create a TextView for the encounter class
        if (encounter.hasClass_()) {
            Coding encounterClass = encounter.getClass_();
            String classDisplay = encounterClass.getCode();
            addTextView(layout, "Encounter Class: " + classDisplay);
        }

        // Create TextView for the subject of the encounter (patient)
        if (encounter.hasSubject()) {
            String patientReference = encounter.getSubject().getReference();
            // Here, you may want to extract the actual patient information if available
            addTextView(layout, "Patient Reference: " + patientReference);
        }

        // Add additional encounter details as necessary
        if (encounter.hasPeriod()) {
            String start = encounter.getPeriod().getStart().toString();
            String end = encounter.getPeriod().getEnd() != null ? encounter.getPeriod().getEnd().toString() : "Ongoing";
            addTextView(layout, "Encounter Period: " + start + " to " + end);
        }
    }

    // Method to display Medication details in the layout
    private void displayMedicationData(Medication medication, LinearLayout layout) {
        // Create a TextView for the medication name
        if (medication.hasCode()) {
            CodeableConcept medicationCode = medication.getCode();
            String medicationName = medicationCode.getCodingFirstRep().getDisplay();
            addTextView(layout, "Medication Name: " + medicationName);
        }

        // Create a TextView for the form of medication (if available)
        if (medication.hasForm()) {
            String form = medication.getForm().getCodingFirstRep().getDisplay();
            addTextView(layout, "Form: " + form);
        }

        // Create TextView for ingredients (if any)
        if (medication.hasIngredient()) {
            medication.getIngredient().forEach(ingredient -> {
                if (ingredient.hasItemCodeableConcept()) {
                    String ingredientName = ingredient.getItemCodeableConcept().getCodingFirstRep().getDisplay();
                    addTextView(layout, "Ingredient: " + ingredientName);
                }
            });
        }

        // Add additional medication details as necessary
    }


    // Method to display MedicationRequest details in the layout
    private void displayMedicationRequestData(MedicationRequest medicationRequest, LinearLayout layout) {
        // Create a TextView for the medication name
        if (medicationRequest.hasMedicationCodeableConcept()) {
            CodeableConcept medication = medicationRequest.getMedicationCodeableConcept();
            String medicationName = medication.getCodingFirstRep().getDisplay();
            addTextView(layout, "Medication: " + medicationName);
        }

        // Create a TextView for the status
        if (medicationRequest.hasStatus()) {
            addTextView(layout, "Status: " + medicationRequest.getStatus().toString());
        }

        // Create TextView for dosage instructions
        if (medicationRequest.hasDosageInstruction()) {
            for (Dosage dosage : medicationRequest.getDosageInstruction()) {
                String dosageText = dosage.getText();
                if (dosageText != null && !dosageText.isEmpty()) {
                    addTextView(layout, "Dosage: " + dosageText);
                }
            }
        }

        // Create a TextView for the subject of the medication request
        if (medicationRequest.hasSubject()) {
            addTextView(layout, "Patient: " + medicationRequest.getSubject().getDisplay());
        }

        // Add additional medication request details as necessary
    }

    // Method to display Organization details in the layout
    private void displayOrganizationData(Organization organization, LinearLayout layout) {
        // Create a TextView for the name

        addTextView(layout, "Name: " + organization.getName());

        // Create a TextView for the identifier
        if (organization.hasIdentifier()) {
            organization.getIdentifier().forEach(identifier -> {
                addTextView(layout, "Identifier: " + identifier.getValue());
            });
        }

        // Create a TextView for the type (if available)
        if (organization.hasType()) {
            organization.getType().forEach(codeableConcept -> {
                addTextView(layout, "Type: " + codeableConcept.getCodingFirstRep().getDisplay());
            });
        }

        // Create TextView for address
        if (organization.hasAddress()) {
            organization.getAddress().forEach(address -> {
                String addressStr = address.getText();
                if (addressStr == null || addressStr.isEmpty()) {
                    addressStr = address.getLine().toString();
                }
                addTextView(layout, "Address: " + addressStr);
            });
        }

        // Add additional organization details as necessary
    }


    // Method to display Practitioner details in the layout
    private void displayPractitionerData(Practitioner practitioner, LinearLayout layout) {
        // Create a TextView for the name
        String name = getPractitionerFullName(practitioner);
        addTextView(layout, "Practitioner");
        addTextView(layout, "Name: " + name);

        // Create a TextView for the identifier
        if (practitioner.hasIdentifier()) {
            practitioner.getIdentifier().forEach(identifier -> {
                addTextView(layout, "Identifier: " + identifier.getValue());
            });
        }

        // Create a TextView for the gender
        if (practitioner.hasGender()) {
            addTextView(layout, "Gender: " + practitioner.getGender().getDisplay());
        }

        // Create a TextView for the specialty (if any)
        if (practitioner.hasQualification()) {
            practitioner.getQualification().forEach(qualification -> {
                if (qualification.hasCode()) {
                    addTextView(layout, "Specialty: " + qualification.getCode().getCodingFirstRep().getDisplay());
                }
            });
        }

        // Add additional practitioner details as necessary
    }

    // Method to get the full name of the practitioner
    private String getPractitionerFullName(Practitioner practitioner) {
        StringBuilder fullName = new StringBuilder();
        System.out.println("print name outside");
        if (practitioner.hasName()) {
            System.out.println("print name inside");
            System.out.println(practitioner.getName());
            practitioner.getName().forEach(humanName -> {
                if (humanName.hasText()) {
                    System.out.println("print name inside has text ");
                    System.out.println("print name inside  " + humanName.getText().toString());
                    System.out.println("print name inside 2");
                    fullName.append(humanName.getText().toString()).append(" ");
//                    for (StringType given : humanName.getText().toString()) {
//                        System.out.println("print name inside hashgiven");
//                        fullName.append(given).append(" ");
//                    }
                }
//                if (humanName.hasFamily()) {
//                    System.out.println("print name inside hasfamily");
//                    fullName.append(humanName.getText()).append(" ");
//                }
            });
        }
        return fullName.toString().trim();
    }


    // Method to display Composition details in the layout
    private void displayCompositionData(Composition composition, LinearLayout layout) {
        // Create a TextView for the title
//        addTextView(layout, "Title: " + composition.getTitle());

        TextView resourceTitle = new TextView(getContext());
        resourceTitle.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(45)));
        resourceTitle.setText(composition.getTitle());
        Typeface typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal); // custom_font.ttf in res/font
        resourceTitle.setTypeface(typeface);
        resourceTitle.setTextSize(18);
        resourceTitle.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
        resourceTitle.setGravity(Gravity.CENTER);
        resourceTitle.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_darkblue)); // Custom color from colors.xml
//        resourceTitle.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue)); // Custom color from colors.xml
        layout.addView(resourceTitle);

        // Create a TextView for the status
        addTextView(layout, "Status: " + composition.getStatus().getDisplay());

        // Create a TextView for the composition date
        addTextView(layout, "Date: " + composition.getDate().toString());

        // Display author details
        for (Reference author : composition.getAuthor()) {
            addTextView(layout, "Author: " + author.getDisplay());
        }

        // Display section details
        for (Composition.SectionComponent section : composition.getSection()) {
            displaySectionDetails(section, layout); // Display section data recursively
        }
    }

    // Method to display Composition section details recursively
    private void displaySectionDetails(Composition.SectionComponent section, LinearLayout layout) {
        // Create a TextView for the section title
        if (section.hasTitle())
            addTextView(layout, "Section: " + (section.hasTitle() ? section.getTitle() : ""));

        // Create a TextView for the section text summary (if available)
        if (section.hasText() && section.getText().hasDiv()) {
            addTextView(layout, "Text: " + section.getText().getDiv().getValueAsString());
        }

        // Recursively handle subsections, if any
        if (!section.getSection().isEmpty()) {
            for (Composition.SectionComponent subSection : section.getSection()) {
                displaySectionDetails(subSection, layout);  // Recursive call for subsections
            }
        }
    }


    // Utility method to add a TextView with dynamic content
    private void addTextView(LinearLayout container, String text) {
        TextView textView = new TextView(getContext());
        textView.setText(text);
        Typeface typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal); // custom_font.ttf in res/font
        textView.setTypeface(typeface);
        textView.setTextSize(16);
        textView.setTextColor(Color.BLACK);
//        textView.setPadding(0, 0, 0, 0);
        container.addView(textView,new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,dpToPx(35)));
    }

    // Utility method to add a TextView with dynamic content
    private void addDownloadTextView(LinearLayout container, String text, byte[] data, String title) {
        TextView textView = new TextView(getContext());
        textView.setText(text);
        Typeface typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal); // custom_font.ttf in res/font
        textView.setTypeface(typeface);
        textView.setTextSize(16);
        textView.setPadding(0, 8, 0, 8);
        textView.setTextColor(ContextCompat.getColor(getContext(), R.color.appbarColor)); // Custom color from colors.xml
        textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                Toast.makeText(getContext(), text, Toast.LENGTH_LONG).show();
                saveFile(data, title);
            }
        });
        container.addView(textView);
    }

    private void saveFile(byte[] bytes, String title) {
        Log.i("myLog", "saveFile ");
        FileOutputStream fos = null;
        try {
            fos = getContext().openFileOutput(title + ".pdf", Context.MODE_PRIVATE);
            Log.i("myLog", "bytes: " + bytes.length);
            fos.write(bytes);

            File cacheFile = new File(getContext().getCacheDir(), title + ".pdf");
            try (FileOutputStream fos1 = new FileOutputStream(cacheFile)) {
                fos1.write(bytes);
            }

            Uri pdfUri = FileProvider.getUriForFile(getContext(),
                    getContext().getPackageName() + ".fileprovider",
                    cacheFile);

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(pdfUri, "application/pdf");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            try {
                startActivity(intent);
            } catch (ActivityNotFoundException e) {
                Toast.makeText(getContext(), "No PDF viewer app installed", Toast.LENGTH_SHORT).show();
            }

        } catch (IOException e) {
            Log.i("myLog", "File write error: " + e.getMessage());
        } finally {
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    Log.i("mylog", "Error closing file output stream: " + e.getMessage());
                }
            }
        }
    }




}
