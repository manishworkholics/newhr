import { useEffect, useState } from "react";
import { Globe2, MapPin } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIPitchGenerator from "./components/AIPitchGenerator";
import InquiryDashboard from "./components/InquiryDashboard";
import { apiRequest } from "./api";

export default function CitiesPage() {
  const [cms, setCms] = useState({ cityDetails: [] });
  const [registerOpen, setRegisterOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [preselectedCity, setPreselectedCity] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    apiRequest("/cms")
      .then((data) => {
        setCms({
          cityDetails: data.cities?.filter((city) => city.status !== "Draft") || []
        });
      })
      .catch(() => { });
  }, []);

  const openRegistration = (city = "") => {
    setPreselectedCity(city);
    setRegisterOpen(true);
  };

  return (
    <div className="site-shell">
      <Header
        onOpenRegister={() => openRegistration()}
        onOpenDashboard={() => setDashboardOpen(true)}
      />

      <main className="cities-page">
        <section className="section city-showcase">
          <div className="container city-showcase-heading">
            <h1 className="section-title">Our {cms.cityDetails.length} Summit Cities &amp;<br />Their Historical Legacies</h1>
            <p>
              Every city on the TalentMax Roadshow is a unique tapestry of historic wonders and dynamic corporate
              powerhouses. Select a city to pre-fill your VIP matchmaking credentials.
            </p>
          </div>

          <div className="container city-showcase-grid">
            {cms.cityDetails.map((city) => (
              <article
                className="city-showcase-card cursor-pointer transition hover:-translate-y-1"
                key={city.id || city.name}
                onClick={() => openCityModal(city)}
              >
                <div className="city-showcase-image">
                  {city.image ? <img src={city.image} alt={city.landmark || city.name} /> : <div className="city-image-fallback"><MapPin size={34} /></div>}
                </div>
                <div className="city-showcase-body">
                  <h3><MapPin size={16} /> {city.name}</h3>
                  <p>{city.historicalInsight}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <AIPitchGenerator
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        preselectedCity={preselectedCity}
      />
      <InquiryDashboard
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
      />
    </div>
  );
}
