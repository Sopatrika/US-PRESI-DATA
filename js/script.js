// le lien du json utilisé
// https://github.com/stiles/presidential-elections/blob/6859f12bf0c4211b33c9aa067839610820f59690/data/processed/presidential_results_states_all.json
var annee_tableau = Array.from(new Set(data.map(item => item.year))); // Set supprime les doublons
var choix_actuel = annee_tableau.length - 1;
var annee_choix = annee_tableau[choix_actuel]; // Dernière année d'élection

const USA_map = document.querySelector(".USA_map");
const path_USA_map = document.querySelectorAll(".USA_map path");
const etat_USA_map = Array.from(path_USA_map).slice(0, 51); // Ne contient que les 51 premier paths (états + D.C.)
const nom_etat = document.querySelector(".nom_etat");
const titre_etat = document.querySelector(".titre_etat");
const select_year = document.getElementById("select_annee");
const select_etat = document.getElementById("selection-etat");
const medaille = document.querySelector(".medaille");
const barre_democrats = document.querySelector(".barre_democrats");
const barre_republicain = document.querySelector(".barre_republicain");


//Animation apparition carte
document.addEventListener("scroll", function() {
    var scroll = window.scrollY + 500;
    var position_bar = USA_map.getBoundingClientRect().top + window.scrollY;
    
    if (scroll > position_bar) {
        path_USA_map.forEach((path) => { 
            const delay_random = Math.random() * 5;
            const duration_random = Math.random() * 2 + 0.5;
            path.style.animation = `apparition_etat ${duration_random}s ease ${delay_random}s forwards`;
        });
    }
},{ passive: false });


//Interactions avec svg
etat_USA_map.forEach((state) => {
    //Hover
    state.addEventListener("mouseenter", function(e) {
        const id_etat = this.id.replace("_", " ");
        nom_etat.textContent = id_etat;
    });
    state.addEventListener("mouseleave", function() {
        nom_etat.textContent = "";
    });

    //Clique
    state.addEventListener("click", function(e) {
        etat_USA_map.forEach(s => {
            s.classList.remove("state_open");
        });
        this.classList.add("state_open");
        titre_etat.textContent = this.id.replace("_", " ");
        select_etat.value = this.id;
        e.stopPropagation();

        state_clicked = this.id.replace("_", " ");
        info_gauche(state_clicked);
    });
});

window.onload = () => {
  state_clicked = "Etats-Unis";
  info_gauche(state_clicked);
  barre_resultat();
  nuage_bulle();
  diagramme_points_divergentes();
};


function info_gauche(state_clicked) {
    var dataAnnee = data.filter(item => item.year === annee_choix); //On filtre les données pour l'année choisie
    if (state_clicked != "Etats-Unis") {
        dataAnnee.forEach(item => { //On compare chaque valeur de dataAnnee avec un svg
            if (state_clicked === item.state) {
                document.getElementById("dem_vote_pop").textContent = item.d_votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                document.getElementById("rep_vote_pop").textContent = item.r_votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                document.getElementById("others_vote_pop").textContent = item.o_votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                document.getElementById("total_vote_pop").textContent = item["total vote"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                document.getElementById("dem_vote_el").textContent = item.d_ev;
                document.getElementById("rep_vote_el").textContent = item.r_ev;

                calcul_angle(item.d_votes, item.r_votes);
            }
        });
    }
    else {
        var total_dem_votes = 0;
        var total_rep_votes = 0;
        var total_other_votes = 0;
        var total_votes = 0;
        var total_dem_EV = 0;
        var total_rep_EV = 0;
        
        dataAnnee.forEach(item => {
            total_dem_votes += item.d_votes;
            total_rep_votes += item.r_votes;
            total_other_votes += item.o_votes;
            total_votes += item["total vote"];
            total_dem_EV += item.d_ev;
            total_rep_EV += item.r_ev;
        });
        
        // Affichage des totaux nationaux
        document.getElementById("dem_vote_pop").textContent = total_dem_votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        document.getElementById("rep_vote_pop").textContent = total_rep_votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        document.getElementById("others_vote_pop").textContent = total_other_votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        document.getElementById("total_vote_pop").textContent = total_votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        document.getElementById("dem_vote_el").textContent = total_dem_EV;
        document.getElementById("rep_vote_el").textContent = total_rep_EV;

        calcul_angle(total_dem_votes, total_rep_votes);
    }
}

//calculer angle
function calcul_angle(dem, rep) {
    document.getElementById("value_dem").textContent = dem.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    document.getElementById("value_rep").textContent = rep.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    const total = dem + rep;
    if (total === 0) {
        balance(0);
        return;
    }
    
    const difference = rep - dem;
    // Si résultat positif = penche vers républicain
    // Si résultat négatif = penche vers démocrates
    const ratio = difference / total;
    const angle = ratio * 30;  // 30° c'est le angle maximum
    
    balance(angle);
}

// Fonction balance corrigée
function balance(angle) {
    const groupe = document.getElementById('Balance_animation');
    const votesDem = document.getElementById('Votes_dem');
    const votesRep = document.getElementById('Votes_rep');
    
    const centreX = 171.229;
    const centreY = 82.2832;
    
    // Appliquer les transformations
    groupe.style.transformOrigin = `${centreX}px ${centreY}px`;
    groupe.style.transform = `rotate(${angle}deg)`;
    
    votesDem.style.transform = `rotate(${-angle}deg)`;
    votesRep.style.transform = `rotate(${-angle}deg)`;
    
    votesDem.style.transformOrigin = '30px 81.8672px';
    votesRep.style.transformOrigin = '311.891px 80.8672px';
}

//Barre des résultats
function barre_resultat() {
    var dataAnnee = data.filter(item => item.year === annee_choix);
    var total_dem_EV = 0;
    var total_rep_EV = 0;

    dataAnnee.forEach(item => {
            total_dem_EV += item.d_ev;
            total_rep_EV += item.r_ev;
        });
    
    total_EV = (total_dem_EV + total_rep_EV)
    nbr_EV_win = total_EV / 2;
    document.getElementById("total_electeur").textContent = nbr_EV_win.toFixed(0) +" pour gagner";
    const ratio_dem = (total_dem_EV / total_EV) * 100;
    const ratio_rep = (total_rep_EV / total_EV) * 100;
    barre_democrats.style.width = ratio_dem+"%";
    barre_republicain.style.width = ratio_rep+"%";

    if (total_dem_EV > total_rep_EV) {
        medaille.style.right = "";
        medaille.style.left = "10%";
    }
    else if (total_dem_EV < total_rep_EV) {
        medaille.style.left = "";
        medaille.style.right = "10%";
    }
    else {
        medaille.style.display = "none";
    }
}


//Remplir le select
document.addEventListener("DOMContentLoaded", function() {
    select_etat.innerHTML = '<option value="Etats-Unis">Etats-Unis</option>';
    etat_USA_map.forEach(etat => {
        select_etat.innerHTML += `<option value="${etat.id}">${etat.id.replace("_", " ")}</option>`;
    });
});


//Choix option du select
select_etat.addEventListener("change", function() {
    option_select = this.value;
    state_clicked = option_select;
    titre_etat.textContent = this.value.replace("_", " ");
    etat_USA_map.forEach(state => {
            state.classList.remove("state_open");
            if (option_select !== "Etats-Unis" && state.id == option_select) {
                state.classList.add("state_open");
            }
        });
    info_gauche(state_clicked);
})

//Remplir le select dans le header
annee_tableau.reverse().forEach((annee, index) => {
    select_year.innerHTML += `<option value="${index}">${annee}</option>`;
});

//selectionner l'année
select_year.addEventListener("change", function() {
    choix_actuel = parseInt(this.value); //Convertir en select_length
    annee_choix = annee_tableau[choix_actuel];

    barre_resultat();
    ColorerCarte(); // mettre à jour la carte
    info_gauche(state_clicked);
    nuage_bulle();
    diagramme_points_divergentes()
})


// sélectionner l'année avec la molette.
select_year.addEventListener('wheel', function(e) {
    e.preventDefault();
    const current_option = this.selectedIndex; //Numéro de l'option selectionné
    const select_length = this.options.length; //Longueur du select
    if (e.deltaY < 0 && current_option > 0) {
        this.selectedIndex = current_option - 1;
    } else if (e.deltaY > 0 && current_option < select_length - 1) {
        this.selectedIndex = current_option + 1;
    }
    
    this.dispatchEvent(new Event('change')); // Déclencher change pour mettre à jour tout le reste
    svg_select();
},{ passive: false } );

//Désactiver le scroll temporairement lorsqu'on survol select_year
select_year.addEventListener('mouseenter', function() {
    svg_select();
    document.querySelector(".souris_svg").style.opacity = "1";
});

select_year.addEventListener('mouseleave', function() {
    document.body.style.overflow = '';
    document.querySelector(".svg_select:first-child").style.opacity = "0";
    document.querySelector(".svg_select:last-child").style.opacity = "0";
    document.querySelector(".souris_svg").style.opacity = "0";
});

function svg_select() {
    if (select_year.selectedIndex == 0) {
        document.querySelector(".svg_select:first-child").style.opacity = "0";
        document.querySelector(".svg_select:last-child").style.opacity = "1";
        console.log("2020")
    }
    else if (select_year.selectedIndex == select_year.options.length - 1) {
        document.querySelector(".svg_select:first-child").style.opacity = "1";
        document.querySelector(".svg_select:last-child").style.opacity = "0";
        console.log("1974")
    }
    else {
        document.querySelector(".svg_select:first-child").style.opacity = "1";
        document.querySelector(".svg_select:last-child").style.opacity = "1";
    }
}

function ColorerCarte() {
    var dataAnnee = data.filter(item => item.year === annee_choix); //On filtre les données pour l'année choisie
    etat_USA_map.forEach(etat => {
        dataAnnee.forEach(item => { //On compare chaque valeur de dataAnnee avec un svg
            if (etat.id.replace("_", " ") === item.state) {
                if (item.winner === "REP") {
                    etat.style.fill = "var(--republicans)";
                } else if (item.winner === "DEM") {
                    etat.style.fill = "var(--democrats";
                } else {
                    etat.style.fill = "var(--fond_gris)";
                }
            }
        });
    });
}
// Initialise la carte
ColorerCarte();

// Nuage de points
const nuage_bulle_etat = document.querySelector(".nuage_bulles_etat");
const nuage_bulle_etat_info = document.querySelector(".nuage_bulles_etat_info");

function nuage_bulle() {
    nuage_bulle_etat.innerHTML = "";
    nuage_bulle_etat_info.innerHTML = ""; // On vide aussi le conteneur d'infos
    
    dataAnnee = data
    .filter(item => item.year === annee_choix)
    .sort((a, b) => (b.r_ev + b.d_ev) - (a.r_ev + a.d_ev));
    
    const bulles_placees = [];

    dataAnnee.forEach(state => {
        const bulle_etat = document.createElement('div');
        bulle_etat.className = 'bulle_etat';
        const ev_total = state.r_ev + state.d_ev;
        const taille = 40 + (ev_total * 2);
        const rayon = taille / 2;
        
        bulle_etat.style.width = `${taille}px`;
        bulle_etat.style.height = `${taille}px`;

        let top, left;
        let collision = true;
        let tentatives = 0;

        while (collision && tentatives < 100) { 
            top = Math.random() * (nuage_bulle_etat.clientHeight - taille);
            left = Math.random() * (nuage_bulle_etat.clientWidth - taille);
            collision = false;

            for (let b of bulles_placees) {
                const distance_x = (left + rayon) - (b.x + b.r);
                const distance_y = (top + rayon) - (b.y + b.r);
                const distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y);
                if (distance < (rayon + b.r) * 0.85) {
                    collision = true;
                    break;
                }
            }
            tentatives++;
        }

        bulles_placees.push({ x: left, y: top, r: rayon });

        bulle_etat.style.top = top + "px";
        bulle_etat.style.left = left + "px";

        if (state.winner == "REP") {
            bulle_etat.style.background = "var(--republicans)";
        } else {
            bulle_etat.style.background = "var(--democrats)";
        }
        bulle_etat.innerHTML = `<b>${state.state.substring(0, 2)}</b>:<b>${ev_total}</b>`;

        // --- GESTION DE L'INFO BULLE EXTERNE ---
        const info_bulle = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        info_bulle.setAttribute("class", "info_bulle");
        info_bulle.setAttribute("viewBox", "0 0 200 60"); 
        
        // Positionnement de l'info bulle par rapport à la bulle
        // On centre l'info bulle (width 200px) sur le centre de la bulle (left + rayon)
        // Et on la place au dessus (top)
        info_bulle.style.left = (left + rayon) + "px";
        info_bulle.style.top = (top) + "px";

        const text_content = `${state.state} : ${ev_total} grands élécteurs`;
        info_bulle.innerHTML = `
        <path d="M 5,5 H 195 A 5,5 0 0 1 200,10 V 45 A 5,5 0 0 1 195,50 H 110 L 100,60 L 90,50 H 5 A 5,5 0 0 1 0,45 V 10 A 5,5 0 0 1 5,5 Z" fill="var(--font_style)"/>
        <foreignObject x="5" y="5" width="190" height="40">
            <div class="info_bulle_text">${text_content}</div>
        </foreignObject>`;

        // On lie l'affichage au survol de la bulle
        bulle_etat.addEventListener('mouseenter', () => info_bulle.style.opacity = "1");
        bulle_etat.addEventListener('mouseleave', () => info_bulle.style.opacity = "0");

        nuage_bulle_etat.appendChild(bulle_etat);
        nuage_bulle_etat_info.appendChild(info_bulle); // Ajout dans le conteneur externe
    });

    apparition_bulle();
}
//Animation des bulles losqu'ils arrivent
function apparition_bulle() {
    const rect = nuage_bulle_etat.getBoundingClientRect();
    const centre_element = rect.top + rect.height / 2 - 100;
    const centre_fenetre = window.innerHeight / 2;

    if (centre_element <= centre_fenetre) {
        const all_bubbles = document.querySelectorAll(".bulle_etat");
        all_bubbles.forEach(bulle => {
            const delay_random = Math.random() * 0.8;
            const duration_random = Math.random() * 0.5 + 0.5;
            bulle.style.animation = `apparition_bulle ${duration_random}s ease ${delay_random}s forwards`;
        });
    }
}

window.addEventListener("resize", nuage_bulle);

// Garde l'écouteur de scroll
window.addEventListener('scroll', apparition_bulle);

// Diagramme de points divergentes
const liste_etats_diagramme = document.querySelector(".etats_diagramme");
const points_etats = document.querySelector(".points_etats");

function diagramme_points_divergentes() {
    liste_etats_diagramme.innerHTML = "";
    document.querySelectorAll(".point_etat").forEach(point_etat => {
        point_etat.remove();
    });
    
    var dataAnnee = data
        .filter(item => item.year === annee_choix)
        .sort((a, b) => (b.r_votes - b.d_votes) / (b.r_votes + b.d_votes) - 
                        (a.r_votes - a.d_votes) / (a.r_votes + a.d_votes));
    
    dataAnnee.forEach(etat => {
        const nom_etat = document.createElement('div');
        nom_etat.className = 'titre_etat_diagramme';
        nom_etat.textContent = etat.state;
        liste_etats_diagramme.appendChild(nom_etat);
        const point_etat = document.createElement('div');
        point_etat.className = 'point_etat';
        
        const total = etat.r_votes + etat.d_votes;
        const position = ((etat.r_votes - etat.d_votes) / total) * 300; 
        
        // --- on crée l'étoile en SVG ---
        const svgNS = "http://www.w3.org/2000/svg";
        const svg_etoile = document.createElementNS(svgNS, "svg");
        svg_etoile.setAttribute("width", "20");  // Taille de l'étoile
        svg_etoile.setAttribute("height", "20");
        svg_etoile.setAttribute("viewBox", "0 0 24 24");
        svg_etoile.style.transform = `translateX(${position}px)`;
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-linejoin", "round"); 

        // Gestion de la couleur
        let couleur = "#ccc"; 
        if (etat.winner == "REP") {
            couleur = "var(--republicans)";
        } else if (etat.winner == "DEM") {
            couleur = "var(--democrats)";
        }
        path.style.fill = couleur;
        path.style.stroke = couleur;

        const span_rep = document.createElement('span');
        const span_dem = document.createElement('span');
        span_rep.className = "span_rep";
        span_dem.className = "span_dem";
        span_rep.textContent = etat.r_pct + "%";
        span_dem.textContent = etat.d_pct + "%";

        // Assemblage
        svg_etoile.appendChild(path);
        point_etat.appendChild(span_dem);
        point_etat.appendChild(svg_etoile);
        point_etat.appendChild(span_rep);
        points_etats.appendChild(point_etat);
    });

    // Ajustement des lignes de fond
    const hauteur = document.querySelector('.diagramme_points_divergentes_flex').scrollHeight;
    document.querySelector(".gradient_fond").style.height = hauteur + 'px';
    document.querySelector(".ligne_centrale").style.height = hauteur + 'px';

    const etat_plus_rep = dataAnnee[0];
    const etat_plus_dem = dataAnnee[dataAnnee.length - 1];
    document.getElementById("etoiles_phrases").innerHTML = `
        <div>État le plus Démocrate : <b>${etat_plus_dem.state}</b> (${etat_plus_dem.d_pct}%)</div>
        <div>État le plus Républicain : <b>${etat_plus_rep.state}</b> (${etat_plus_rep.r_pct}%)</div>
    `;
}

window.addEventListener("resize", apparition_bulle);

const affichage_gauche = document.querySelector(".affichage_gauche");
const button_affichage_gauche = document.querySelector(".button_affichage_gauche_responsiv")
button_affichage_gauche.addEventListener("click", function() {
    affichage_gauche.classList.toggle("affichage_gauche_responsiv");
    document.querySelector(".arrow_affichage_gauche").classList.toggle("arrow_affichage_gauche_responsiv");
    button_affichage_gauche.classList.toggle("button_affichage_gauche_responsiv_gauche")
})


//année footer
document.getElementById('year').textContent = new Date().getFullYear();