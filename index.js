export class HIDRO_PAGE {
    constructor(DivId) {
        this.DataHTML = document.getElementById(DivId);
        this.InnerOfDataHTML();
        this.CameraProses();
    }
    // Buat HTML
    InnerOfDataHTML(){
        this.DataHTML.innerHTML = `
        <div id="Bagian_Utama">
            <div id="Navbar">
                <a href="#default" id="logo1">HYDRO-STIV</a>
            </div>
            <br>
            <br>
            <div id="Kamera">
                <div id="preview1">
                    <video id="preview"></video>
                </div>
                <canvas id="outputOfpreview"></canvas>
                <div id="top-section">
                    <div id="grafick_JSON">
                    </div>
                </div>
            </div>
            <div id="Tombol">
                <button id="button" type="submit">Process</button>
            </div>
            <br>
            <div id="main-content">
                <div id="summary-section">
                    <div id="STIV_MEAS">
                        <label id="Label_STIV_MEAS">STIV MEASUREMENT SUMMARY</label>
                        <div class="measurement">
                            <h3 id="Water_Level">Water Level <br><p id="WaterL">0</p></h3>
                            <h3 id="Max_Surface_Velocit">Max. Surface Velocity <br><p id="MxSV">0</p></h3>
                            <h3 id="Avg_Surface_Velocit">Avg. Surface Velocity <br><p id="AVGxSV">0</p></h3>
                        </div>
                    </div>
                    <div id="DISC_MEAS">
                        <label id="Label_DISC_MEAS">DISCHARGE MEASUREMENT SUMMARY</label>
                        <div class="measurement1">
                            <h3 id="Tot_Dis">Total Discharge <br><p id="TotD">0</p></h3>
                            <h3 id="Tot_Area">Total Area <br><p id="TotAr">0</p></h3>
                            <h3 id="Cross_Avg">Cross Avg. Velocity <br><p id="CrossAvg">0</p></h3>
                        </div>
                    </div>
                </div>
                <div id="Not_Title">
                    <div id="measurement2">
                        <h3 id="Method_DeepL">Method<br><p id="MetDPL"></p></h3>
                        <h3 id="DISC_Area">Discharge Calculation Method<br><p id="DiscAr"></p></h3>
                    </div>
                </div>
                <div id="Table" align="center">
                    <label id="Label_DISC_MEAS">LIST OF MEASUREMENT RESULT</label>
                </div>
            </div>
        </div>

        `
    }

    //Buat Ngambil gambar
    CameraProses(){
        const preview = document.getElementById("preview");
        const outputOfpreview = document.getElementById("outputOfpreview");
        const buttonOfProcessed = document.getElementById("button");

        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 300,
                height: 200
            }
        })

        .then(stream => {
            preview.srcObject = stream;
            preview.play();
        })

        buttonOfProcessed.addEventListener("click" , function()  {
            const context = outputOfpreview.getContext("2d");
            const image1 = "./Simbol_Data/1.png"
            outputOfpreview.width = 300;
            outputOfpreview.height = 200;
            context.drawImage(preview, 0,0, outputOfpreview.width, outputOfpreview.height);
            const screenshoots = context.drawImage(preview, 0,0, outputOfpreview.width, outputOfpreview.height);
            if (image1 === screenshoots) {
                console.log("Berhasil");
            } else {
                console.log("Coba Lagi!")
                buttonOfProcessed.disabled = true;
                fetch("./Simbol_Data/Data1.csv").then( data => {return data.text()}).then(data1 => {
                    const row = data1.split("\r\n");
                    const Jsondata = row.slice(1).map( rows => {
                        const columns = rows.split(";");
                        return {
                            NO : columns[0],
                            Cross_Loc : columns[1],
                            Area : columns[2],
                            Velocity : columns[3],
                            Calibration : columns[4],
                            Discharge : columns[5],
                            DischargeR : columns[6],
                            stringTXT : columns[7],
                        };
                    });
                    // Nampilin data dari JSON File
                    console.log(Jsondata);

                    // Untuk STIV_MEAS
                    const WaterLvl = document.getElementById("WaterL").innerHTML = `${Jsondata[0].Cross_Loc} m`;
                    const  MaxSrf = document.getElementById("MxSV").innerHTML = `${Jsondata[0].Area} m`;
                    const AvgSrf = document.getElementById("AVGxSV").innerHTML = `${Jsondata[0].Velocity} m`;

                    // DISC_MEAS
                    const Tot_Dis1 = document.getElementById("TotD").innerHTML = `${Jsondata[1].Cross_Loc} m`
                    const Tot_Area1 = document.getElementById("TotAr").innerHTML = `${Jsondata[1].Area} m`;
                    const AvgSrf1 = document.getElementById("CrossAvg").innerHTML = `${Jsondata[1].Velocity} m`;

                    // NO TITLE
                    const Method_DeepL1 = document.getElementById("MetDPL").innerHTML = `${Jsondata[0].stringTXT} `
                    const TDISC_Area1 = document.getElementById("DiscAr").innerHTML = `${Jsondata[1].stringTXT} `;

                    // Nampilin grafik
                    const xArray = ["Cross_Loc","Area","Velocity"];
                    const yArray = [Jsondata[0].Cross_Loc, Jsondata[0].Area, Jsondata[0].Velocity];
                    const yArray1 = [Jsondata[1].Cross_Loc, Jsondata[1].Area, Jsondata[1].Velocity];
                    const data = [{
                    x: xArray,
                    y: yArray,
                    type: "line :",
                    line: {color:'red'}},
                    {
                    x: xArray,
                    y: yArray1,
                    type: "line :",
                    line: {color:'blue'}},];
                    const layout = {title:"Grafik Percobaan debit Air xxxx"};
                    Plotly.newPlot("grafick_JSON", data, layout);

                    // Menampilkan Spreasheet Excel di HTML
                    const table = document.createElement('table');
                    const headers = ['NO', 'Cross_Loc', 'Area', 'Velocity', 'Calibration', 'Discharge', 'DischargeR'];
                    // Menambahkan header tabel
                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header;
                    headerRow.appendChild(th);
                    });
                    thead.appendChild(headerRow);
                    table.appendChild(thead);
                    // Menambahkan data ke tabel
                    const tbody = document.createElement('tbody');
                    Jsondata.forEach(item => {
                    const row = document.createElement('tr');
                    headers.forEach(header => {
                        const td = document.createElement('td');
                        td.textContent = item[header];
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                    });
                    table.appendChild(tbody);
                    // Menambahkan tabel ke elemen dengan id "Table"
                    document.getElementById('Table').appendChild(table);
                })                
            }
        })
    }
}