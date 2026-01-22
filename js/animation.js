//Animation d'initialisation du site web

document.addEventListener("DOMContentLoaded", () => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    gsap.set([".fond-rouge", ".rayures-blanches"], { scaleX: 0, transformOrigin: "left center" });
    gsap.set(".carre-bleu", { scale: 0, transformOrigin: "center center" });
    gsap.set(".groupe-etoiles use, .groupe-etoiles path", { scale: 0, transformOrigin: "center center" });
    gsap.set(".hero_section_right h1, .hero_section_right p, .lien_hero a", { opacity: 0, y: 30 });
    tl.to(".carre-bleu", { scale: 1, duration: 0.5 })
    .to(".groupe-etoiles use, .groupe-etoiles path", { scale: 1, stagger: 0.02, ease: "back.out(1.7)" })
    .to([".fond-rouge", ".rayures-blanches"], { scaleX: 1, duration: 1 }, "-=0.2")
    .to(".usa_container", { yPercent: -110, duration: 1.2, ease: "power4.inOut", delay: 0.5 })
    .set(".usa_container", { display: "none" }) 
    .to(".white_house path", { animation: "dessiner_maison_blanche 10s ease-in-out forwards"})
    .to(".hero_section_right h1, .hero_section_right p, .lien_hero a", { opacity: 1,  y: 0,  stagger: 0.2, duration: 0.8 }, "+=0.5");
});

// Animation de la partie présentation avec GSAP

const section_presentation = document.querySelector(".section_presentation");
const button_presenter = document.querySelector(".button_presentation");
const text_presentation = document.querySelector(".presentation_election>p");
const presentation_map = document.querySelector(".presentation_map");

let etape = 1;

button_presenter.addEventListener("click", function() { 
    button_presenter.style.pointerEvents = "none";
    const etape_actuel = etape;
    console.log(etape);
    const tl = gsap.timeline();

    // 1er partie
    if (etape_actuel === 1) {
		gsap.set(text_presentation, {clipPath: "inset(0 100% 0 0)"});
        tl.to([button_presenter, ".section_presentation > h2"], {opacity: 0, y: -20, duration: 0.8, ease: "power2.in"})
        tl.to(".section_presentation > h2", {display: 'none', duration: 0.8})
        .to(".presentation_map", { opacity: 0, duration: 1 });
        tl.call(() => {
            const present_1 = document.getElementById("present_1");
            const clone = present_1.content.cloneNode(true);
            presentation_map.innerHTML = "";
            presentation_map.appendChild(clone);
            text_presentation.textContent = "Aux États-Unis, le système est bipartite. Deux partis dominent la scène politique : les Démocrates (Bleus) et les Républicains (Rouges). D’autres parties existent mais sont beaucoup plus minoritaires.";
            button_presenter.textContent = "Continuer";
        });
        tl.to(".presentation_map", {opacity: 1, duration: 1}, "+=0.5")
        .to(text_presentation, {opacity: 1, clipPath: "inset(0 0 0 0)", duration: 2})
        .to(button_presenter, {opacity: 1,  y: 0,  duration: 0.8, 
            onComplete: () => { button_presenter.style.pointerEvents = "auto"; 
                etape++;
            }
            
	}, "+=1");
    }

    // 2ème partie
    else if (etape_actuel === 2) {
    tl.to(button_presenter, {opacity: 0, y: -20, duration: 0.8, ease: "power2.in"})
    .to(".presentation_map", { opacity: 0, duration: 1 })
    .to(text_presentation, { opacity: 0, duration: 0.5, 
        onComplete: () => {
            text_presentation.style.clipPath = "inset(0 100% 0 0)";
        }}, "-=1");

    tl.call(() => {
        const template = document.getElementById("present_2");
        const clone = template.content.cloneNode(true);
        presentation_map.innerHTML = "";
        presentation_map.appendChild(clone);
        text_presentation.textContent = "Contrairement à beaucoup de pays, l'élection est indirecte. Les citoyens ne votent pas pour un président, mais pour choisir des représentants (Grands Electeurs) dans leur État";
    });

    tl.to(".presentation_map", { opacity: 1, duration: 1 }, "+=0.5")
    .to("#californie_1", {
        onStart: () => {
            document.querySelector("#californie_1").style.animation = "dessiner_contour 3s ease 0.5s forwards";
        }
    }, "+=0.5")
    .to(text_presentation, { opacity: 1, clipPath: "inset(0 0 0 0)", duration: 2}, "+=0.5")
    .to(button_presenter, { opacity: 1, y: 0, duration: 0.8, 
        onComplete: () => { 
            button_presenter.style.pointerEvents = "auto"; 
            etape++; 
        } 
    }, "+=0.5");
}

    //3ème partie
    else if (etape_actuel === 3) {
    tl.to("#californie_1", {
        onStart: () => {
            document.querySelector("#californie_1").style.animation = "disparition_contour 2s ease forwards";
        }
    }, "+=0.5")
    .to(button_presenter, {opacity: 0, y: -20, duration: 0.8})
    .to(text_presentation, {opacity: 0, clipPath: "inset(0 0 0 100%)", duration: 1.5})
    .to(".presentation_map", { opacity: 0, duration: 1 })
    .call(() => {
        dataAnnee = data.filter(item => item.year === annee_choix);
        presentation_map.innerHTML = "";
        const present_3 = document.getElementById("present_3");
        const clone = present_3.content.cloneNode(true);
        presentation_map.appendChild(clone);
        text_presentation.style.clipPath = "inset(0 100% 0 0)";
        
        let total_dem_EV = 0;
        let total_rep_EV = 0;

        for (let i = 0; i < dataAnnee.length; i++) {
            let item = dataAnnee[i];
            if (item.state === "California") {
                const el = document.getElementById("californie_ev");
                el.textContent = `${item.r_ev + item.d_ev} grands électeurs`;
            } 
            else if (item.state === "Alaska") {
                const el = document.getElementById("alaska_ev");
                el.textContent = `${item.r_ev + item.d_ev} grands électeurs`;
            }
            total_dem_EV += item.d_ev;
            total_rep_EV += item.r_ev;
        }
        
        let total_EV = total_dem_EV + total_rep_EV;
        text_presentation.textContent = `Chaque État possède un nombre de Grands Électeurs proportionnel à sa population. Il y en a ${total_EV} au total au niveau national.`;
    });
    tl.to(".presentation_map", {opacity: 1, duration: 1}, "+=0.5")
    .to(["#californie_2", "#alaska_1"], {
        onStart: () => {
            document.querySelector("#californie_2").style.animation = "dessiner_contour 3s ease 0.2s forwards";
            document.querySelector("#alaska_1").style.animation = "dessiner_contour 3s ease 0.8s forwards";
        }
    }, "+=0.5")
    .to(text_presentation, {opacity: 1, clipPath: "inset(0 0 0 0)", duration: 2}, "+=0.5")
    .to(button_presenter, { opacity: 1,  y: 0,  duration: 0.8, 
        onComplete: () => {
            button_presenter.style.pointerEvents = "auto";
            etape++;
            gsap.set(["#californie_2", "#alaska_1"], { strokeDashoffset: 0, fillOpacity: 1 });
        } 
    }, "+=1");
}

    //4ème partie
    else if (etape_actuel === 4) {
    tl.to(["#californie_1", "#alaska_1"], {
        onStart: () => {
            document.querySelector("#californie_2").style.animation = "disparition_contour 2s ease forwards";
            document.querySelector("#alaska_1").style.animation = "disparition_contour 2s ease forwards";
        }
    }, "+=0.5")
    .to([button_presenter, text_presentation], { opacity: 0, duration: 0.8 }, "+=0.5")
    .to(".presentation_map", { opacity: 0, duration: 1 }, "+=0.5")
    .call(() => {
    presentation_map.innerHTML = "";
    const present_4 = document.getElementById("present_4");
    const clone = present_4.content.cloneNode(true);
    presentation_map.appendChild(clone);

    const containerPoints = document.querySelector(".present_4_points");
    containerPoints.style.display = "flex";
    containerPoints.style.flexDirection = "column";
    containerPoints.style.alignItems = "center";
    
    const lignes = [5, 6, 7]; 
    
    lignes.forEach(nbBoules => {
        const ligneDiv = document.createElement("div");
        ligneDiv.style.display = "flex";
        ligneDiv.style.flexDirection = "row";
        
        for (let i = 0; i < nbBoules; i++) {
            const boule = document.createElement("span");
            boule.className = "boules_partie4";
            ligneDiv.appendChild(boule);
        }
        containerPoints.appendChild(ligneDiv);
    });

    // Initialisation des compteurs pour GSAP
    this.compteurs = { dem: 0, rep: 0 };
})

    // 3. Apparition du conteneur
    .to(".presentation_map", { opacity: 1, duration: 1 })
    .to(this, { duration: 3,
        onStart: () => {
            const idD = document.getElementById("%d");
            const idR = document.getElementById("%r");
            //On crée un compteur pour les deux id
            gsap.to(this.compteurs, { dem: 56, rep: 44, duration: 2.5, ease: "power1.inOut",
                onUpdate: () => {
                    idD.textContent = `Démocrates : ${Math.floor(this.compteurs.dem)}%`;
                    idR.textContent = `Républicains : ${Math.floor(this.compteurs.rep)}%`;
                }
            });
        }
    })
    .call(() => {
    document.querySelectorAll(".boules_partie4").forEach(boule => {
        const delay_random = Math.random() * 2; 
        boule.style.transition = `background 0.5s ease ${delay_random}s`;
        boule.style.background = "var(--democrats)";
    });
})
    .to(text_presentation, { opacity: 1, clipPath: "inset(0 0 0 0)", duration: 1,
        onStart: () => {
            text_presentation.textContent = "Dans 48 États sur 50, la règle est le 'Winner-Take-All' : le candidat qui arrive en tête remporte tous les Grands Électeurs de cet État. Un seul vote de différence suffit.";
        }
    })
    .to(button_presenter, { opacity: 1, y: 0, 
        onComplete: () => { 
            button_presenter.style.pointerEvents = "auto"; 
            etape++;
        } 
    });
    }
    //5ème partie
    else if (etape_actuel === 5) {
    tl.to(button_presenter, {opacity: 0, y: -20, duration: 0.8, ease: "power2.in"})
    .to(".presentation_map", { opacity: 0, duration: 1 })
    .to(text_presentation, { opacity: 0, duration: 0.5, 
        onComplete: () => {
            text_presentation.style.clipPath = "inset(0 100% 0 0)";
        }
    }, "-=1")
    .call(() => {
        presentation_map.innerHTML = "";
        const present_5 = document.getElementById("present_5");
        const clone = present_5.content.cloneNode(true);
        presentation_map.appendChild(clone);

        const dataAnnee = data.filter(item => item.year === annee_choix);
        let cumulDem = 0;
        let cumulRep = 0;
        dataAnnee.forEach(etat => {
            cumulDem += etat.d_ev;
            cumulRep += etat.r_ev;
        });

        const bDem = document.querySelector(".barre_dem_anim");
        const bRep = document.querySelector(".barre_rep_anim");
        const totalEV = 538;

        // Animation des barres vers leurs pourcentages respectifs
        gsap.to(bDem, { width: `${(cumulDem / totalEV) * 100}%`, duration: 2.5, ease: "power2.out" });
        gsap.to(bRep, { width: `${(cumulRep / totalEV) * 100}%`, duration: 2.5, ease: "power2.out" });

        text_presentation.textContent = `Pour devenir Président, il faut obtenir la majorité absolue : 270 Grands Électeurs. C'est une véritable course à travers les etats des États-Unis !`;
        button_presenter.textContent = "Finir";
    })
    .to(".presentation_map", {opacity: 1, duration: 1}, "+=0.5")
    .to(text_presentation, {opacity: 1, clipPath: "inset(0 0 0 0)", duration: 2})
    .to(button_presenter, {
        opacity: 1,  
        y: 0,  
        duration: 0.8, 
        onComplete: () => { 
            button_presenter.style.pointerEvents = "auto"; 
            etape = 0; 
        }
    }, "+=1");
}

//Revenir au début
else if (etape_actuel === 0) {
    tl.to(button_presenter, {opacity: 0, y: -20, duration: 0.8, ease: "power2.in"})
    .to(".presentation_map", { opacity: 0, duration: 1 })
    .to(text_presentation, { opacity: 0, duration: 0.5, 
        onComplete: () => {
            text_presentation.style.clipPath = "inset(0 100% 0 0)";
        }
    }, "-=1")
    .call(() => {
        presentation_map.innerHTML = "";
        text_presentation.innerText = "";
        button_presenter.textContent = "Redécouvrir";
        etape++; 
    })
    tl.to(".section_presentation > h2", {display: 'flex', duration: 0.8})
    .to(".presentation_map", {opacity: 1, duration: 1}, "+=0.5")
    .to([button_presenter, ".section_presentation > h2"], { opacity: 1, y: 0, duration: 0.8,
        onComplete: () => { 
            button_presenter.style.pointerEvents = "auto"; 
            etape++; 
        }
    }, "+=1");
}
})