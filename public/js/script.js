async function getPrice() {

    const symbol = document.getElementById("symbol").value.toUpperCase().trim();

    if (symbol === "") {
        alert("Please enter a stock symbol.");
        return;
    }


    document.getElementById("result").innerHTML = `
        <div class="card">
            <h2 style="color:white;text-align:center;">
                Loading...
            </h2>
        </div>
    `;


    try {

        const API = "https://stockvisionapp.onrender.com";
        
        // Fetch Stock Price
        const priceResponse = await fetch(`${API}/price?symbol=${symbol}`);
        const price = await priceResponse.json();


        // Fetch Company Profile
        const profileResponse = await fetch(`${API}/profile?symbol=${symbol}`);
        const profile = await profileResponse.json();


        // Fetch News
        const newsResponse = await fetch(`${API}/news?symbol=${symbol}`);
        const news = await newsResponse.json();



        // Invalid Symbol Check
        if (!price.c && !profile.name) {

            document.getElementById("result").innerHTML = `
                <div class="card">
                    <h2>❌ Invalid Stock Symbol</h2>
                </div>
            `;

            return;
        }



        let marketStatus =
            price.c > 0 ? "🟢 Market Active" : "🔴 Market Closed";



        // News Section

        let newsHTML = "";


        if (Array.isArray(news) && news.length > 0) {


            news.slice(0,5).forEach(item => {


                newsHTML += `

                <div class="news-card">

                    <h4>${item.headline}</h4>

                    <p>${item.source}</p>

                    <a href="${item.url}" target="_blank">
                        Read More →
                    </a>

                </div>

                `;

            });


        }
        else {


            newsHTML = `

            <div class="news-card">

                <h4>No Latest News Available</h4>

            </div>

            `;

        }




        // Display Dashboard

        document.getElementById("result").innerHTML = `


        <div class="dashboard">


            <div class="card">

                <h2>${symbol}</h2>

                <h3>${marketStatus}</h3>

            </div>



            <div class="price-grid">


                <div class="card">

                    <h3>Current Price</h3>

                    <h2>$${price.c}</h2>

                </div>



                <div class="card">

                    <h3>Today's High</h3>

                    <h2>$${price.h}</h2>

                </div>



                <div class="card">

                    <h3>Today's Low</h3>

                    <h2>$${price.l}</h2>

                </div>



                <div class="card">

                    <h3>Opening Price</h3>

                    <h2>$${price.o}</h2>

                </div>



                <div class="card">

                    <h3>Previous Close</h3>

                    <h2>$${price.pc}</h2>

                </div>


            </div>




            <div class="card profile">


                <div class="profile-header">


                    <img 
                    src="${profile.logo || ''}"
                    class="company-logo"
                    alt="Company Logo">


                    <div>

                        <h2>${profile.name || symbol}</h2>

                        <p>${profile.exchange || ""}</p>

                    </div>


                </div>


                <hr>


                <p>
                <b>Industry:</b>
                ${profile.finnhubIndustry || "N/A"}
                </p>


                <p>
                <b>Country:</b>
                ${profile.country || "N/A"}
                </p>


                <p>
                <b>Currency:</b>
                ${profile.currency || "N/A"}
                </p>


                <p>
                <b>IPO:</b>
                ${profile.ipo || "N/A"}
                </p>


                <p>

                <b>Website:</b>

                <a href="${profile.weburl}" target="_blank">
                Visit Website
                </a>

                </p>



            </div>




            <div class="card">


                <h2>📰 Latest News</h2>


                ${newsHTML}


            </div>



        </div>


        `;



        // Create Chart

        createChart(symbol, price);



    }



    catch(error){


        console.log(error);


        document.getElementById("result").innerHTML = `


        <div class="card">

            <h2>❌ Unable to Fetch Data</h2>

            <p>
            Check server connection or API key.
            </p>


        </div>


        `;


    }


}




// Button Connection

document
.getElementById("searchBtn")
.addEventListener("click", getPrice);




// Enter Key Search

document
.getElementById("symbol")
.addEventListener("keypress", function(event){


    if(event.key === "Enter"){

        getPrice();

    }


});





// Chart Function

function createChart(symbol, price){


    const canvas = document.getElementById("stockChart");


    if(!canvas) return;


    const ctx = canvas.getContext("2d");



    if(window.stockChartInstance){

        window.stockChartInstance.destroy();

    }



    window.stockChartInstance = new Chart(ctx, {


        type:"line",


        data:{


            labels:[

                "Open",
                "Low",
                "High",
                "Current"

            ],


            datasets:[{


                label:symbol+" Price",


                data:[

                    price.o,
                    price.l,
                    price.h,
                    price.c

                ],


                tension:0.3


            }]


        },


        options:{


            responsive:true,


            plugins:{


                legend:{

                    display:true

                }


            }


        }



    });



}
