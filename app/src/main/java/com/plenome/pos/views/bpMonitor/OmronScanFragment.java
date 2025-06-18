package com.plenome.pos.views.bpMonitor;

import static com.itextpdf.kernel.pdf.PdfName.App;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.DeviceConfiguration.OmronPeripheralManagerConfig;
import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.Interface.OmronPeripheralListener;
import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.Interface.OmronPeripheralManagerConnectListener;
import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.Interface.OmronPeripheralManagerDataTransferListener;
import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.Interface.OmronPeripheralManagerScanListener;
import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.Interface.OmronPeripheralManagerStopScanListener;
import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.LibraryManager.OmronPeripheralManager;
import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.Model.OmronErrorInfo;
import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.Model.OmronPeripheral;
import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.OmronUtility.OmronConstants;
import com.plenome.pos.R;
import com.plenome.pos.adapters.OmronDeviceListAdapter;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.views.OPHubApplication;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Set;

import butterknife.BindView;
import butterknife.ButterKnife;

public class OmronScanFragment extends Fragment {

    private OmronDeviceListAdapter omronDeviceListAdapter;
    private ArrayList<Integer> selectedUsers = new ArrayList<>();
    private Context applicationContext = OPHubApplication.getInstance().getApplicationContext();
    private OmronPeripheral selectedPeripheral;
    private BluetoothAdapter bluetoothAdapter;
    private final ArrayList<BluetoothDevice> foundDevices = new ArrayList<>();
    @BindView(R.id.relScan)
    RelativeLayout rel;
    @BindView(R.id.scanRtl)
    RelativeLayout scanRtl;
    @BindView(R.id.imgScan)
    ImageView imgScan;
    @BindView(R.id.scanning_for)
    TextView txtScanning;
    @BindView(R.id.txt_device_name)
    TextView txtDevName;
    @BindView(R.id.txt_connecting)
    TextView txtConnecting;
    @BindView(R.id.recycDeviceList)
    RecyclerView recycDeviceList;

    @BindView(R.id.pblay)
    RelativeLayout pblay;


    View rootView;
    RestServices services;
    Handler mHandler;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.dialog_device_scan_omron, container, false);
        ButterKnife.bind(this, rootView);

        // Register pairing request receiver
        IntentFilter filter = new IntentFilter(BluetoothDevice.ACTION_PAIRING_REQUEST);
        filter.setPriority(IntentFilter.SYSTEM_HIGH_PRIORITY);
        requireActivity().registerReceiver(pairingRequestReceiver, filter);

        services = RetrofitInstance.createService(RestServices.class);
        OPHubApplication.appBarImage.setVisibility(View.GONE);
        selectedUsers.add(2);

        //  Register both receivers early
        registerPairingReceiver();
        registerDiscoveryReceiver();
        startOmrondeviceScan();
        return rootView;
    }
    private void registerPairingReceiver() {
        try {
            IntentFilter filter = new IntentFilter(BluetoothDevice.ACTION_PAIRING_REQUEST);
            filter.setPriority(IntentFilter.SYSTEM_HIGH_PRIORITY);
            requireActivity().registerReceiver(pairingRequestReceiver, filter);
        } catch (Exception e) {
            Log.e("BLE", "Pairing receiver register failed", e);
        }
    }

    private void registerDiscoveryReceiver() {
        try {
            IntentFilter filter = new IntentFilter(BluetoothDevice.ACTION_FOUND);
            requireActivity().registerReceiver(discoveryReceiver, filter);
        } catch (Exception e) {
            Log.e("BLE", "Discovery receiver register failed", e);
        }
    }

    private void startOmrondeviceScan() {
        OmronPeripheralManagerConfig peripheralConfig = OmronPeripheralManager.sharedManager(applicationContext).getConfiguration();
        peripheralConfig.userHashId = OPHubApplication.getUserName();
        OmronPeripheralManager.sharedManager(applicationContext).setConfiguration(peripheralConfig);
        OmronPeripheralManager.sharedManager(applicationContext).startManager();
        OmronPeripheralManager.sharedManager(applicationContext).startScanPeripherals(new OmronPeripheralManagerScanListener() {
            @Override
            public void onScanCompleted(ArrayList<OmronPeripheral> peripheralList, OmronErrorInfo errorInfo) {
                if (peripheralList != null) {

                    if (peripheralList.isEmpty()) {
                        Toast.makeText(getContext(), "No Deivce Found", Toast.LENGTH_SHORT).show();
                    } else {
                        Handler handler = new Handler(Looper.getMainLooper());
                        handler.post(new Runnable() {
                            @Override
                            public void run() {
                                stopScan();
                                scanRtl.setVisibility(View.GONE);
                                // Set up the GridLayoutManager with 2 columns
                                GridLayoutManager gridLayoutManager = new GridLayoutManager(getContext(), 3);
                                recycDeviceList.setLayoutManager(gridLayoutManager);
                                omronDeviceListAdapter = new OmronDeviceListAdapter();
                                omronDeviceListAdapter.ItemAdapter(peripheralList, getContext());
                                recycDeviceList.setAdapter(omronDeviceListAdapter);
                                recycDeviceList.setVisibility(View.VISIBLE);
                                omronDeviceListAdapter.setOnClickListener(new OmronDeviceListAdapter.OnClickListener() {
                                    @Override
                                    public void onClick(int position, OmronPeripheral item) {
                                        Toast.makeText(getActivity(), "Please Wait...", Toast.LENGTH_SHORT).show();
                                        pblay.setVisibility(View.VISIBLE);
                                        selectedPeripheral = item;

                                        Log.d("selectedPeripheralCheck", "onClick: "+selectedPeripheral.getLocalName());

                                        startBluetoothDiscovery();
                                    }

                                });
                            }
                        });

                    }
                }else {
                    System.out.println("print null point");
                }
            }

        });
    }



    private void startBluetoothDiscovery() {
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();

        if (bluetoothAdapter == null) {
            Toast.makeText(getContext(), "Bluetooth not supported", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!bluetoothAdapter.isEnabled()) {
            bluetoothAdapter.enable();
            Toast.makeText(getContext(), "Turning Bluetooth ON. Please wait...", Toast.LENGTH_SHORT).show();
            new Handler(Looper.getMainLooper()).postDelayed(this::startBluetoothDiscovery, 2000);
            return;
        }

        if (bluetoothAdapter.getState() != BluetoothAdapter.STATE_ON) {
            Toast.makeText(getContext(), "Bluetooth initializing. Please wait...", Toast.LENGTH_SHORT).show();
            new Handler(Looper.getMainLooper()).postDelayed(this::startBluetoothDiscovery, 2000);
            return;
        }

        // Start discovery safely
        if (bluetoothAdapter.isDiscovering()) {
            bluetoothAdapter.cancelDiscovery();
        }
        foundDevices.clear();
        bluetoothAdapter.startDiscovery();
        Log.d("BLE", "Discovery started");
    }

    private final BroadcastReceiver discoveryReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (BluetoothDevice.ACTION_FOUND.equals(intent.getAction())) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if (device != null && device.getName() != null) {
                    Log.d("BLE", "Found device: " + device.getName());
                    if (selectedPeripheral != null && device.getName().equals(selectedPeripheral.getLocalName())) {
                        Log.d("BLE", "Match found! Stopping discovery...");
                        bluetoothAdapter.cancelDiscovery();
                        safeUnregister(discoveryReceiver);

                        if (device.getBondState() == BluetoothDevice.BOND_NONE) {
                            Log.d("BLE", "Initiating Pairing...");
                            device.createBond();
                        } else if (device.getBondState() == BluetoothDevice.BOND_BONDED) {
                            Log.d("BLE", "Already paired, connecting...");
                            connectToDevice(selectedPeripheral);
                        } else {
                            Log.d("BLE", "Pairing in progress...");
                        }
                    }
                }
            }
        }
    };

    private final BroadcastReceiver pairingRequestReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (BluetoothDevice.ACTION_PAIRING_REQUEST.equals(intent.getAction())) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                try {
                    device.setPairingConfirmation(true);
                    abortBroadcast();
                    Log.d("BLE", "Pairing confirmed programmatically");
                } catch (Exception e) {
                    Log.e("BLE", "Error confirming pairing", e);
                }
            }
        }
    };

    private void safeUnregister(BroadcastReceiver receiver) {
        try {
            requireActivity().unregisterReceiver(receiver);
        } catch (IllegalArgumentException e) {
            // Already unregistered
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        safeUnregister(pairingRequestReceiver);
        safeUnregister(discoveryReceiver);
    }

    public void stopScan(){
        OmronPeripheralManager.sharedManager(applicationContext).stopScanPeripherals(new OmronPeripheralManagerStopScanListener() {
            @Override
            public void onStopScanCompleted(OmronErrorInfo errorInfo) {
                System.out.println("print stop scan");
            }

        });
    }

    @Override
    public void onResume() {
        super.onResume();

        if (selectedPeripheral != null){
            Log.d("ListDatras", "onResume: "+selectedPeripheral.getModelName()+"-"+selectedPeripheral.getModelSeries());
            mHandler = new Handler();
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    transferData();

                }
            }, 3000);


        }
    }


    private void startOmronPeripheralManager(boolean isHistoricDataRead, boolean isPairing) {
        OmronPeripheralManagerConfig peripheralConfig = OmronPeripheralManager.sharedManager(applicationContext).getConfiguration();
        peripheralConfig.timeoutInterval = 15;
        peripheralConfig.userHashId = OPHubApplication.getUserName();
        peripheralConfig.enableAllDataRead = isHistoricDataRead;
        HashMap<Integer, Integer> sequenceNumbersForTransfer = new HashMap<>();
        sequenceNumbersForTransfer.put(1, 42);
        sequenceNumbersForTransfer.put(2, 8);
        peripheralConfig.sequenceNumbersForTransfer = sequenceNumbersForTransfer;
        OmronPeripheralManager.sharedManager(applicationContext).setConfiguration(peripheralConfig);
        OmronPeripheralManager.sharedManager(applicationContext).startManager();
    }



    private void connectToDevice(OmronPeripheral item) {
        OmronPeripheralManager.sharedManager(OPHubApplication.getInstance().getApplicationContext())
                .connectPeripheral(item, true, new OmronPeripheralManagerConnectListener() {
                    @Override
                    public void onConnectCompleted(OmronPeripheral peripheral, OmronErrorInfo errorInfo) {
                        System.out.println("print error info : " + errorInfo);
                        if (peripheral != null) {
                            OmronPeripheralManagerConfig peripheralConfig = OmronPeripheralManager.sharedManager(applicationContext).getConfiguration();
                            Log.i("myLog", "Device Config :  " + peripheralConfig.getDeviceConfigGroupIdAndGroupIncludedId(peripheral.getDeviceGroupIDKey(), peripheral.getDeviceGroupIncludedGroupIDKey()));
                            if(peripheral.getVitalData() != null) {
                                Toast.makeText(getActivity(), "Data Found 1", Toast.LENGTH_SHORT).show();
                            } else {
                                Toast.makeText(getActivity(), "No Data Found 1", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(getActivity(), "Error Not Found", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }



    private void transferData() {
        startOmronPeripheralManager(true, false);
        Log.i("myLog", "transfer Data");

        OmronPeripheral peripheralLocal = new OmronPeripheral(selectedPeripheral.getLocalName(), selectedPeripheral.getUuid());

        OmronPeripheralManager.sharedManager(applicationContext).startDataTransferFromPeripheral(peripheralLocal, 1, true, OmronConstants.OMRONVitalDataTransferCategory.All, new
                OmronPeripheralManagerDataTransferListener() {
                    @Override
                    public void onDataTransferCompleted(OmronPeripheral peripheral, OmronErrorInfo errorInfo) {
                        if (peripheral != null) {
                            Toast.makeText(getActivity(), "Success", Toast.LENGTH_SHORT).show();
                            OmronPeripheralManager.sharedManager(applicationContext
                            ).endDataTransferFromPeripheral(new OmronPeripheralManagerDataTransferListener() {
                                @Override
                                public void onDataTransferCompleted(OmronPeripheral peripheral, OmronErrorInfo errorInfo) {
                                    if (peripheral != null) {
                                        retrieveDetails(peripheral);
                                        requireActivity().runOnUiThread(() -> {
                                            pblay.setVisibility(View.GONE);
                                            Toast.makeText(getActivity(), "Data Transfer Complete", Toast.LENGTH_SHORT).show();
                                        });
                                    } else {
                                        pblay.setVisibility(View.GONE);
                                        Toast.makeText(getActivity(), "Error", Toast.LENGTH_SHORT).show();

                                    }
                                }
                            });
                        }
                    }
                });
    }







    private void retrieveDetails(OmronPeripheral peripheral) {
        peripheral.getVitalDataWithUser(1, new OmronPeripheralListener() {
            @Override
            public void onGetVitalDataCompleted(HashMap<String, Object> vitalData, OmronErrorInfo errorInfo) {
                final ArrayList<HashMap<String, Object>> bloodPressureItemList =
                        (ArrayList<HashMap<String, Object>>)
                                vitalData.get(OmronConstants.OMRONVitalDataBloodPressureKey);
                if (bloodPressureItemList != null) {
                    Log.i("myLog", "Blood Pressure:" + bloodPressureItemList.get(
                            bloodPressureItemList.size() - 1).toString());
                    Log.i("myLog", "Blood Pressure sys:" + bloodPressureItemList.get(
                            bloodPressureItemList.size() - 1).get("OMRONVitalDataSystolicKey").toString());
                    Log.i("myLog", "Blood Pressure Dia:" + bloodPressureItemList.get(
                            bloodPressureItemList.size() - 1).get("OMRONVitalDataDiastolicKey").toString());
                    Log.i("myLog", "Blood Pressure Pulse:" + bloodPressureItemList.get(
                            bloodPressureItemList.size() - 1).get("OMRONVitalDataPulseKey").toString());

                    OmronBpResultFragment newFragment = new OmronBpResultFragment();
                    FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                    Bundle result = new Bundle();
                    result.putString("Blood_Pressure_sys", bloodPressureItemList.get(
                            bloodPressureItemList.size() - 1).get("OMRONVitalDataSystolicKey").toString());
                    result.putString("Blood_Pressure_Dia", bloodPressureItemList.get(
                            bloodPressureItemList.size() - 1).get("OMRONVitalDataDiastolicKey").toString());
                    result.putString("Blood_Pressure_Pulse", bloodPressureItemList.get(
                            bloodPressureItemList.size() - 1).get("OMRONVitalDataPulseKey").toString());
                    newFragment.setArguments(result);
                    transaction.replace(R.id.fragment_container, newFragment, "Omron_scan_result");
                    transaction.addToBackStack(null);
                    transaction.commit();
                }
            }
        });
    }


}