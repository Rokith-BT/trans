package com.plenome.pos.views;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.plenome.pos.R;

import org.json.JSONObject;

import android.os.Environment;

import androidx.annotation.NonNull;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import org.json.JSONArray;

import java.io.File;
import java.io.FileOutputStream;

public class CreateClinicalNotesPdf extends AppCompatActivity {
    private static final int REQUEST_CODE = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_CODE);
        } else {
            createPdf();
        }
    }

    private void createPdf() {
        //    String jsonData = "{ \"status\": \"success\", \"messege\": \"clinical fetched added successfully\", \"details\": { ... }}"; // Your JSON data
        String jsonData = "{\n" +
                "    \"status\": \"success\",\n" +
                "    \"messege\": \"clinical fetched added successfully\",\n" +
                "    \"details\": {\n" +
                "        \"OpdDetails\": {\n" +
                "            \"date\": \"7th Oct 2024\",\n" +
                "            \"time\": \"10:19 AM\",\n" +
                "            \"opd_no\": \"OPDN1\",\n" +
                "            \"consultant\": \"Matheshwari N\"\n" +
                "        },\n" +
                "        \"chiefComplaintsBasic\": [\n" +
                "            {\n" +
                "                \"id\": 4,\n" +
                "                \"opd_id\": 1,\n" +
                "                \"chief_complaints_detail_id\": 7,\n" +
                "                \"complaints_name\": \"Head pain\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"created_at\": \"2024-10-17T06:03:19.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 5,\n" +
                "                \"opd_id\": 1,\n" +
                "                \"chief_complaints_detail_id\": 8,\n" +
                "                \"complaints_name\": \"Head pain\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"created_at\": \"2024-10-17T07:01:28.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 6,\n" +
                "                \"opd_id\": 1,\n" +
                "                \"chief_complaints_detail_id\": 9,\n" +
                "                \"complaints_name\": \"Head pain\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"created_at\": \"2024-10-17T07:08:29.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 7,\n" +
                "                \"opd_id\": 1,\n" +
                "                \"chief_complaints_detail_id\": 10,\n" +
                "                \"complaints_name\": \"Head pain\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"created_at\": \"2024-10-17T11:20:21.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 11,\n" +
                "                \"opd_id\": 1,\n" +
                "                \"chief_complaints_detail_id\": 14,\n" +
                "                \"complaints_name\": \"Head pain\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"created_at\": \"2024-10-18T13:11:36.000Z\"\n" +
                "            }\n" +
                "        ],\n" +
                "        \"chiefComplaintDetails\": {\n" +
                "            \"id\": 7,\n" +
                "            \"opd_id\": 1,\n" +
                "            \"count\": \"1\",\n" +
                "            \"duration_limit\": \"days\",\n" +
                "            \"remarks\": \" head is paining for the past 2 days\",\n" +
                "            \"filled_using\": \"voice\",\n" +
                "            \"created_at\": \"2024-10-17T06:03:19.000Z\"\n" +
                "        },\n" +
                "        \"pastTreatmentHistory\": {\n" +
                "            \"id\": 1,\n" +
                "            \"opd_id\": 1,\n" +
                "            \"history\": \"history of the report will be written here\",\n" +
                "            \"filled_using\": \"scrible\",\n" +
                "            \"created_at\": \"2024-10-16T12:41:03.000Z\"\n" +
                "        },\n" +
                "        \"pastTreatmentHistoryDocs\": [\n" +
                "            {\n" +
                "                \"id\": 1,\n" +
                "                \"past_history_id\": 1,\n" +
                "                \"opd_id\": 1,\n" +
                "                \"document\": \"documentssss.pdf\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"created_at\": \"2024-10-16T12:41:03.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 2,\n" +
                "                \"past_history_id\": 2,\n" +
                "                \"opd_id\": 1,\n" +
                "                \"document\": \"document.pdf\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"created_at\": \"2024-10-17T06:03:19.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 3,\n" +
                "                \"past_history_id\": 3,\n" +
                "                \"opd_id\": 1,\n" +
                "                \"document\": \"document.pdf\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"created_at\": \"2024-10-17T07:01:28.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 4,\n" +
                "                \"past_history_id\": 4,\n" +
                "                \"opd_id\": 1,\n" +
                "                \"document\": \"document.pdf\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"created_at\": \"2024-10-17T07:08:29.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 5,\n" +
                "                \"past_history_id\": 5,\n" +
                "                \"opd_id\": 1,\n" +
                "                \"document\": \"document.pdf\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"created_at\": \"2024-10-17T11:20:21.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 9,\n" +
                "                \"past_history_id\": 9,\n" +
                "                \"opd_id\": 1,\n" +
                "                \"document\": \"document.pdf\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"created_at\": \"2024-10-18T13:11:36.000Z\"\n" +
                "            }\n" +
                "        ],\n" +
                "        \"diagnosisReport\": [\n" +
                "            {\n" +
                "                \"id\": 2,\n" +
                "                \"test_categories\": \"Pathology\",\n" +
                "                \"sub_category\": \"blood test\",\n" +
                "                \"laboratory\": \"laboratory\",\n" +
                "                \"remarks\": \"remarks of the report will be written here\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"opd_id\": 1,\n" +
                "                \"created_at\": \"2024-10-17T06:03:19.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 3,\n" +
                "                \"test_categories\": \"Pathology\",\n" +
                "                \"sub_category\": \"blood test\",\n" +
                "                \"laboratory\": \"laboratory\",\n" +
                "                \"remarks\": \"remarks of the report will be written here\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"opd_id\": 1,\n" +
                "                \"created_at\": \"2024-10-17T07:01:28.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 4,\n" +
                "                \"test_categories\": \"Pathology\",\n" +
                "                \"sub_category\": \"blood test\",\n" +
                "                \"laboratory\": \"laboratory\",\n" +
                "                \"remarks\": \"remarks of the report will be written here\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"opd_id\": 1,\n" +
                "                \"created_at\": \"2024-10-17T07:08:29.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 5,\n" +
                "                \"test_categories\": \"Pathology\",\n" +
                "                \"sub_category\": \"blood test\",\n" +
                "                \"laboratory\": \"laboratory\",\n" +
                "                \"remarks\": \"remarks of the report will be written here\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"opd_id\": 1,\n" +
                "                \"created_at\": \"2024-10-17T11:20:21.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 6,\n" +
                "                \"test_categories\": \"Pathology\",\n" +
                "                \"sub_category\": \"blood test\",\n" +
                "                \"laboratory\": \"laboratory\",\n" +
                "                \"remarks\": \"remarks of the report will be written here\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"opd_id\": 1,\n" +
                "                \"created_at\": \"2024-10-17T11:20:21.000Z\"\n" +
                "            },\n" +
                "            {\n" +
                "                \"id\": 10,\n" +
                "                \"test_categories\": \"Pathology\",\n" +
                "                \"sub_category\": \"blood test\",\n" +
                "                \"laboratory\": \"laboratory\",\n" +
                "                \"remarks\": \"remarks of the report will be written here\",\n" +
                "                \"filled_using\": \"voice\",\n" +
                "                \"opd_id\": 1,\n" +
                "                \"created_at\": \"2024-10-18T13:11:36.000Z\"\n" +
                "            }\n" +
                "        ],\n" +
                "        \"dietPlan\": {\n" +
                "            \"id\": 1,\n" +
                "            \"opd_id\": 1,\n" +
                "            \"diet_plan\": \"diet plan for the patients\",\n" +
                "            \"filled_using\": \"voice\",\n" +
                "            \"created_at\": \"2024-10-16T12:41:03.000Z\"\n" +
                "        },\n" +
                "        \"treatmentAdvice\": {\n" +
                "            \"id\": 1,\n" +
                "            \"opd_id\": 1,\n" +
                "            \"treatment_advice\": \"advise for the patients will be written here\",\n" +
                "            \"created_at\": \"2024-10-16T12:41:04.000Z\",\n" +
                "            \"filled_using\": \"scrible\"\n" +
                "        },\n" +
                "        \"followUp\": {\n" +
                "            \"id\": 1,\n" +
                "            \"opd_id\": 1,\n" +
                "            \"count\": \"1\",\n" +
                "            \"duration\": \"days\",\n" +
                "            \"date\": \"2024-11-10T18:30:00.000Z\",\n" +
                "            \"remarks\": \"head is paining for the past 2 daysss\",\n" +
                "            \"filled_using\": \"voice\",\n" +
                "            \"created_at\": \"2024-10-16T12:41:04.000Z\"\n" +
                "        }\n" +
                "    }\n" +
                "}";
        try {
            JSONObject jsonObject = new JSONObject(jsonData);
            JSONObject details = jsonObject.getJSONObject("details");
            JSONObject opdDetails = details.getJSONObject("OpdDetails");

            // Set the PDF file path
            File pdfDir = new File(Environment.getExternalStorageDirectory(), "PDFs");
            if (!pdfDir.exists()) {
                pdfDir.mkdirs();
            }
            File pdfFile = new File(pdfDir, "clinical_report.pdf");
            PdfWriter writer = new PdfWriter(new FileOutputStream(pdfFile));
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Add OPD details
            document.add(new Paragraph("OPD Details").setBold().setFontSize(20));
            document.add(new Paragraph("Date: " + opdDetails.getString("date")));
            document.add(new Paragraph("Time: " + opdDetails.getString("time")));
            document.add(new Paragraph("OPD No: " + opdDetails.getString("opd_no")));
            document.add(new Paragraph("Consultant: " + opdDetails.getString("consultant")));
            document.add(new Paragraph("\n"));

            // Add Chief Complaints
            document.add(new Paragraph("Chief Complaints").setBold().setFontSize(20));
            JSONArray chiefComplaints = details.getJSONArray("chiefComplaintsBasic");
            for (int i = 0; i < chiefComplaints.length(); i++) {
                JSONObject complaint = chiefComplaints.getJSONObject(i);
                document.add(new Paragraph(complaint.getString("complaints_name")));
            }
            document.add(new Paragraph("\n"));

            // Add Treatment History
            document.add(new Paragraph("Past Treatment History").setBold().setFontSize(20));
            JSONObject treatmentHistory = details.getJSONObject("pastTreatmentHistory");
            document.add(new Paragraph("History: " + treatmentHistory.getString("history")));
            document.add(new Paragraph("\n"));

            // Add Diagnosis Reports
            document.add(new Paragraph("Diagnosis Reports").setBold().setFontSize(20));
            JSONArray diagnosisReports = details.getJSONArray("diagnosisReport");
            for (int i = 0; i < diagnosisReports.length(); i++) {
                JSONObject report = diagnosisReports.getJSONObject(i);
                document.add(new Paragraph(report.getString("test_categories") + ": " + report.getString("remarks")));
            }
            document.add(new Paragraph("\n"));

            // Add Diet Plan
            JSONObject dietPlan = details.getJSONObject("dietPlan");
            document.add(new Paragraph("Diet Plan: " + dietPlan.getString("diet_plan")));
            document.add(new Paragraph("\n"));

            // Add Treatment Advice
            JSONObject treatmentAdvice = details.getJSONObject("treatmentAdvice");
            document.add(new Paragraph("Treatment Advice: " + treatmentAdvice.getString("treatment_advice")));
            document.add(new Paragraph("\n"));

            // Add Follow Up
            JSONObject followUp = details.getJSONObject("followUp");
            document.add(new Paragraph("Follow Up: " + followUp.getString("date") + " - " + followUp.getString("remarks")));

            // Close the document
            document.close();
            pdfDoc.close();
            writer.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_CODE && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            createPdf();
        } else {
            // Handle permission denial
        }
    }

}
