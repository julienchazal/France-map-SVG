$(document).ready(function(){

    var l = window.location.pathname;
    var splitted = l.split("/");
    var rootpath = "";
    for (var i=0; i<splitted.length-2; i++) {
        rootpath += splitted[i] + "/";
    }

    // A ENLEVER POUR IMPLEMENTATION
    var rootpath = '';

    // chargement des données villes/régions
    $.getJSON(rootpath+"datas/json/geocoordonnees.json", function( data ) {

        // l'ensemble des infos retournées permet de placer les points sur la carte
        var jsonPlots=data;

        var ALLdepartments = ['Nord', 'Pas-de-Calais',
                            'Oise', 'Aisne', 'Somme',
                            'Seine-Maritime', 'Eure',
                            'Ardennes', 'Marne', 'Aube', 'Haute-Marne',
                            'Moselle', 'Meuse', 'Meurthe-et-Moselle', 'Vosges',
                            "Bas-Rhin","Haut-Rhin",
                            'Manche', 'Calvados', 'Orne',
                            "Val-d'Oise","Seine-Saint-Denis","Paris","Hauts-de-Seine","Yvelines","Val-de-Marne","Seine-et-Marne","Essonne",
                            'Finistère', "Côtes-d'Armor", 'Morbihan', 'Ille-et-Vilaine',
                            'Mayenne', 'Sarthe', 'Loire-Atlantique', 'Maine-et-Loire', 'Vendée',
                            "Eure-et-Loir","Loiret","Loir-et-Cher","Indre-et-Loire","Indre","Cher",
                            "Yonne","Côte-d'Or","Saône-et-Loire","Nièvre",
                            "Haute-Saône","Doubs","Territoire-de-Belfort","Jura",
                            "Deux-Sèvres","Vienne","Charente","Charente-Maritime",
                            'Creuse', 'Corrèze', 'Haute-Vienne',
                            "Allier","Puy-de-Dôme","Cantal","Haute-Loire",
                            'Ain', 'Loire', 'Rhône', 'Haute-Savoie', 'Savoie', 'Isère', 'Drôme', 'Ardèche',
                            'Gironde', 'Dordogne', 'Lot-et-Garonne', 'Pyrénées-Atlantiques', 'Landes',
                            'Lot', 'Aveyron', 'Tarn', 'Tarn-et-Garonne', 'Haute-Garonne', 'Gers', 'Hautes-Pyrénées', 'Ariège',
                            'Lozère', 'Gard', 'Hérault', 'Aude', 'Pyrénées-Orientales',
                            "Hautes-Alpes","Alpes-de-Haute-Provence","Alpes-Maritimes","Vaucluse","Bouches-du-Rhône","Var",
                            "Haute-Corse", "Corse-du-Sud"];

        var DOM = ['Guadeloupe','Martinique','Réunion','Guyane','Mayotte'];

        var villesRegion=[],
            villesHorsRegion=[],
            regions=[],
            villes = [];

        var usemap = {

            // fonction d'initialisation des villes, lancée après l'initialisation de la carte
            initVilles : function () {

                $.each(data, function (i, itemData) {
                    cxOffset = itemData.pxoffset;
                    cyOffset = itemData.pyoffset;
                    ville = itemData.idVille;
                    regiondelaville = itemData.nameRegion;

                    // rend le nom de toutes les villes invisible
                    $('text[data-id="'+ville+'"]').hide();

                    // si il existe un offset sur le point de la ville dans le JSON,
                    // on le récupère et l'ajoute à la position initiale du point
                    if (cxOffset != 0 || cyOffset != 0) {
                        plot = $('circle[data-id="'+ville+'"]');
                        cy = plot.attr('cy');
                        cx = plot.attr('cx');

                        plot.attr({
                            cx: parseInt(cx)+parseInt(cxOffset),
                            cy: parseInt(cy)+parseInt(cyOffset)
                        });
                    }
                });
            },

            // fonction pour filtrer les villes selon la région cliquée
            filtreVilles : function (id) {

                villesRegion=[];
                villesHorsRegion=[];
                regions=[];
                villes = [];

                $.each(data, function (i, itemData) {

                    regions[i] = itemData.nameRegion; // tableau de toutes les régions
                    villes[i] = itemData.idVille; // tableau de toutes les villes (utilisé au click sur le bouton "Retour à la carte")

                    if(itemData.nameRegion == id) {
                        villesRegion[i] = itemData.idVille; // tableau de toutes les ville de la région
                    } else  {
                        villesHorsRegion[i] = itemData.idVille; // tableau de toutes les villes hors région
                    }
                });
            }
        }

        $maparea=$(".maparea");


        $maparea.mapael({

            map :
            {
                name : "map_france" // construction de la carte à partir du fichier map_france.js
                , zoom: {
                    enabled: true,
                    maxLevel : 20
                }
                , defaultPlot : { // comportement et affichage par défaut pour les villes
                    attrs : {
                        "fill":"#000",
                        "stroke-width": 0,
                        opacity : 0.6
                    },
                    attrsHover : {
                        "fill":"#000",
                        "stroke-width": 0,
                         opacity:1
                    },
                    text : {
                        attrs : {
                            "font-size":"6",
                            "fill":"#000",
                            "opacity" : "0.5"
                            // "font-weight" : "650"
                        },
                        attrsHover : {
                            "fill":"#000",
                            "opacity":"1"
                        }
                    }
                },
                width: 600,
                defaultArea : { // comportement et affichage par défaut pour les paths (régions et départements)
                    attrs : {fill: "#db5120", stroke: "#ffffff", "stroke-width": 1, "stroke-linejoin" : "round", opacity:0.5},
                    attrsHover : {fill: "#db5120", opacity:1, animDuration : 200},
                    eventHandlers : {
                        // fonction pour le click sur un path du SVG
                        click: function(e, id, mapElem, textElem ) {

                            // active la fonction uniquement si on click sur un path "région"
                            // (en mode zoom où les paths "région" sont invisibles, le click sur un path "département" ne fera rien)
                            if ($.inArray(id, ALLdepartments) == -1) {

                                $(".map").addClass('zoom');
                                $('#retourCarte').show(); // affiche le btn "retour à la carte"

                                var updatedOptions = {'areas' : {}, 'plots' : {}},
                                    // on récupère différentes variables dans le tableau de définition de chaque région
                                    departments = mapElem.originalAttrs.departments, // départements associés à la région
                                    lati = mapElem.originalAttrs.latitude, // lat et long pour le zoom au centre de la région
                                    longi = mapElem.originalAttrs.longitude;
                                    // offset pour le zoom sur les régions proches des limites du svg
                                    // (on modifiera plus loin les valeurs top et left de positionnement du SVG -> ligne 196)
                                    xOffsetSVG = mapElem.originalAttrs.xOffsetSVG;
                                    yOffsetSVG = mapElem.originalAttrs.yOffsetSVG;

                                    usemap.filtreVilles(id); // on passe l'id de la région comme paramètre à la fonction


                                // même couleur normal/survol pour tous les départements associés à la région cliquée
                                $.each(departments, function(index, val) {
                                     updatedOptions.areas[val] = {
                                        attrs: {
                                            fill: "#db5120",
                                            stroke :"#ed7042",
                                            opacity:1
                                        },
                                        attrsHover: {
                                            fill: "#db5120",
                                            stroke :"#ed7042",
                                            opacity:1
                                        }
                                    }
                                });

                                // getCoords, définie dans map_france.js, transforme lat/long en coordonnées x/y sur le SVG
                                var coords = $.fn.mapael.maps.map_france.getCoords(lati, longi);

                                // zoom spécifique pour IDF, zoom pour le reste des régions cliquées
                                if (id=="Ile-De-France") {
                                    $maparea.trigger('zoom', [12, coords.x, coords.y]);
                                } else {
                                    $maparea.trigger('zoom', [6, coords.x, coords.y]);
                                }

                                // fonction qui update la carte avec les nouvelles données
                                $maparea.trigger('update', [updatedOptions, {}, [], {afterUpdate : function ( $self, paper , areas, plots, options) {
                                    // toutes les régions deviennent invisibles
                                    $.each(regions, function(index, val) {
                                        $('path[data-id="'+val+'"]').hide();
                                    });
                                    // affiche les départements associés à la région clickée
                                    $.each(departments, function(index, val) {
                                        $('path[data-id="'+val+'"]').show();
                                    });
                                    // rend invisibles les points villes hors région clickée
                                    $.each(villesHorsRegion, function(index, val) {
                                        $('circle[data-id="'+val+'"]').hide();
                                    });
                                    // affiche les noms des villes associées à la région clickée
                                    $.each(villesRegion, function(index, val) {
                                        $('text[data-id="'+val+'"]').show();
                                    });

                                    // si le tableau de définition de la région contient un offset SVG
                                    // on modifie les valeurs top et left de positionnement du SVG
                                    if (xOffsetSVG != undefined || yOffsetSVG != undefined) {
                                        $('svg').css({
                                            top: yOffsetSVG,
                                            left: xOffsetSVG
                                        });
                                    }

                                    $('path').css('cursor', 'auto'); // curseur normal au survol des départements (mode zoom)
                                    $('circle, text').css('cursor', 'pointer'); // curseur main sur les villes (mode zoom)

                                } } ] );
                            }
                        }
                    }
                },
                // fonction lancée après l'initialisation de la carte
                afterInit : function($self, paper, areas, plots, options) {

                    // rend invisibles tous les départements
                    $.each(ALLdepartments, function(index, val) {
                        $('path[data-id="'+val+'"]').hide();
                    });

                    $('path').css('cursor', 'pointer'); // curseur main au survol des régions

                    usemap.initVilles(); // lance la fonction d'initialisation des villes

                    // affiche le nom de la région en légende au survol (uniquement en mode dézoomé)
                    $('path').hover(function() {
                        if (!$('.map').hasClass('zoom')) {
                            nomRegion = $(this).attr('data-id');
                            $('#legende').html(nomRegion);
                        }
                    }, function() {
                        if (!$('.map').hasClass('zoom')) {
                            $('#legende').empty();
                        }
                    });
                }
            },
            areas: {
                // tableaux de définitions des régions (voir ligne 141)
                "Guadeloupe" : {
                    attrs : {
                        transform :'t0,-83',
                        'departments' : ['Guadeloupe'],
                        'latitude' : 16.265000,
                        'longitude' : -61.551000,
                        'xOffsetSVG' : 290
                    }
                },

                "Martinique" : {
                    attrs : {
                        transform :'t0,-83',
                        'departments' : ['Martinique'],
                        'latitude' : 14.641528,
                        'longitude' : -61.024174,
                        'xOffsetSVG' : 290
                    }
                },

                "Guyane" : {
                    attrs : {
                        transform :'t0,-83',
                        'departments' : ['Guyane'],
                        'latitude' : 3.933889,
                        'longitude' : -53.125782,
                        'xOffsetSVG' : 290
                    }
                },

                "Mayotte" : {
                    attrs : {
                        transform :'t0,-83',
                        'departments' : ['Mayotte'],
                        'latitude' : -12.827500,
                        'longitude' : 45.166244,
                        'xOffsetSVG' : 290,
                        'yOffsetSVG' : -200
                    }
                },

                "Réunion" : {
                    attrs : {
                        transform :'t0,-83',
                        'departments' : ['Réunion'],
                        'latitude' : -21.115141,
                        'longitude' : 55.536384,
                        'xOffsetSVG' : 290
                    }
                },

                'Nord-Pas-de-Calais' : {
                    attrs : {
                        'departments' : ['Nord', 'Pas-de-Calais'],
                        'latitude' : 50.629250,
                        'longitude' : 3.057256,
                        'xOffsetSVG' : 50,
                        'yOffsetSVG' : 250
                    }
                },

                'Picardie' : {
                    attrs : {
                        'departments' : ['Oise', 'Aisne', 'Somme'],
                        'latitude' : 49.663613,
                        'longitude' : 2.528073,
                        'yOffsetSVG' : 100
                    }
                },

                'Haute-Normandie' : {
                    attrs : {
                        'departments' : ['Seine-Maritime', 'Eure'],
                        'latitude' : 49.524641,
                        'longitude' : 0.882833
                    }
                },

                'Champagne-Ardenne' : {
                    attrs : {
                        'departments' : ['Ardennes', 'Marne', 'Aube', 'Haute-Marne'],
                        'latitude' : 48.793409,
                        'longitude' : 4.472525
                    }
                },

                'Lorraine' : {
                    attrs : {
                        'departments' : ['Moselle', 'Meuse', 'Meurthe-et-Moselle', 'Vosges'],
                        'latitude' : 48.874423,
                        'longitude' : 6.208093
                    }
                },

                'Alsace' : {
                    attrs : {
                        'departments' : ["Bas-Rhin","Haut-Rhin"],
                        'latitude' : 48.318179,
                        'longitude' : 7.441624,
                        'xOffsetSVG' : -120,
                        'yOffsetSVG' : 40
                    }
                },

                'Basse-Normandie' : {
                    attrs : {
                        'departments' : ['Manche', 'Calvados', 'Orne'],
                        'latitude' : 48.878847,
                        'longitude' : -0.515749
                    }
                },

                'Ile-De-France' : {
                    attrs : {
                        'departments' : ["Val-d'Oise","Seine-Saint-Denis","Paris","Hauts-de-Seine","Yvelines","Val-de-Marne","Seine-et-Marne","Essonne"],
                        'latitude' : 48.849920,
                        'longitude' : 2.637041,
                        'xOffsetSVG' : 50,
                        'yOffsetSVG' : -20
                    }
                },

                'Bretagne' : {
                    attrs : {
                        'departments' : ['Finistère', "Côtes-d'Armor", 'Morbihan', 'Ille-et-Vilaine'],
                        'latitude' : 48.202047,
                        'longitude' : -2.932644,
                        'xOffsetSVG' : 70,
                        'yOffsetSVG' : 20
                    }
                },

                'Pays-de-la-Loire' : {
                    attrs : {
                        'departments' : ['Mayenne', 'Sarthe', 'Loire-Atlantique', 'Maine-et-Loire', 'Vendée'],
                        'latitude' : 47.763284,
                        'longitude' : -0.329969,
                        'xOffsetSVG' : 70,
                        'yOffsetSVG' : -20
                    }
                },

                'Centre' : {
                    attrs : {
                        'departments' : ["Eure-et-Loir","Loiret","Loir-et-Cher","Indre-et-Loire","Indre","Cher"],
                        'latitude' : 47.751569,
                        'longitude' : 1.675063
                    }
                },

                'Bourgogne' : {
                    attrs : {
                        'departments' : ["Yonne","Côte-d'Or","Saône-et-Loire","Nièvre"],
                        'latitude' : 47.052505,
                        'longitude' : 4.383721
                    }
                },

                'Franche-Comté' : {
                    attrs : {
                        'departments' : ["Haute-Saône","Doubs","Territoire-de-Belfort","Jura"],
                        'latitude' : 47.134321,
                        'longitude' : 6.022302
                    }
                },

                'Poitou-Charentes' : {
                    attrs : {
                        'departments' : ["Deux-Sèvres","Vienne","Charente","Charente-Maritime"],
                        'latitude' : 45.903552,
                        'longitude' : -0.309184
                    }
                },

                'Limousin' : {
                    attrs : {
                        'departments' : ['Creuse', 'Corrèze', 'Haute-Vienne'],
                        'latitude' : 45.893223,
                        'longitude' : 1.569602
                    }
                },

                'Auvergne' : {
                    attrs : {
                        'departments' : ["Allier","Puy-de-Dôme","Cantal","Haute-Loire"],
                        'latitude' : 45.703269,
                        'longitude' : 3.344854
                    }
                },

                'Rhône-Alpes' : {
                    attrs : {
                        'departments' : ['Ain', 'Loire', 'Rhône', 'Haute-Savoie', 'Savoie', 'Isère', 'Drôme', 'Ardèche'],
                        'latitude' : 45.169580,
                        'longitude' : 5.450282
                    }
                },

                'Aquitaine' : {
                    attrs : {
                        'departments' : ['Gironde', 'Dordogne', 'Lot-et-Garonne', 'Pyrénées-Atlantiques', 'Landes'],
                        'latitude' : 44.700222,
                        'longitude' : -0.299579,
                        'xOffsetSVG' : 20,
                        'yOffsetSVG' : -50
                    }
                },

                'Midi-Pyrénées' : {
                    attrs : {
                        'departments' : ['Lot', 'Aveyron', 'Tarn', 'Tarn-et-Garonne', 'Haute-Garonne', 'Gers', 'Hautes-Pyrénées', 'Ariège'],
                        'latitude' : 44.085943,
                        'longitude' : 1.520862,
                        'yOffsetSVG' : -50
                    }
                },

                'Languedoc-Roussillon' : {
                    attrs : {
                        'departments' : ['Lozère', 'Gard', 'Hérault', 'Aude', 'Pyrénées-Orientales'],
                        'latitude' : 43.591236,
                        'longitude' : 3.258363
                    }
                },

                'PACA' : {
                    attrs : {
                        'departments' : ["Hautes-Alpes","Alpes-de-Haute-Provence","Alpes-Maritimes","Vaucluse","Bouches-du-Rhône","Var"],
                        'latitude' : 43.935169,
                        'longitude' : 6.067919
                    }
                },

                'Corse' : {
                    attrs : {
                        'departments' : ["Haute-Corse", "Corse-du-Sud"],
                        'latitude' : 42.039604,
                        'longitude' : 9.012893,
                        'xOffsetSVG' : -200,
                        'yOffsetSVG' : -150
                    }
                }

            },
            plots : jsonPlots // construction des villes à partir des données JSON (ligne 7)
        });

        // au click sur les villes
        $('text, circle').on('click',function() {
            if ($('.map').hasClass('zoom'))
                {
                    // $('#sessions').remove(); // efface la liste des réunions d'une ville précédemment cliquée
                    var villeId = $(this).attr('data-id'); // récupère l'id de la ville cliquée
                    $.ajax({
                        url: rootpath+"datas/traitement.php",
                        type: "POST",
                        data: { id_ville : villeId }, // poste l'id de la ville clickée à la page traitement.php qui renvoie le tableau JSON des réunions correspondantes
                        success: function(data) {
                            var html ='';

                            // $('.maparea').append('<div id="sessions"><a class="close">x</a></div>');
                            $('#sessions').modal('show');

                            var villesId=[], villeName='';

                            // @TODO :
                            // quand la methode SAFTI::get_reunions_information() pourra renvoyer faux :
                            // le tester

                            if( data.sessions !== false )
                            {
                                $.each(data.sessions, function(index, item) {
                                    villesId[index] = item.idVille;
                                    // villeName = (item.ville_session !== null) ? ' pour '+item.ville_session : '' ; // BDD SAFTI
                                    if (villeId == item.idVille) { // A COMMENTER SI BDD SAFTI
                                            // si il existe une réunion dans la ville clickée on construit l'affichage des infos relatives

                                            rawUrlInscription = data.url_inscription+'?id_session='+item.id_session+'&lieu_session='+item.ville_session+'&date_session='+item.date_session+'&heure_session='+item.heure_session;
                                            urlInscription = encodeURI(rawUrlInscription);

                                            html += '<div class="sessionItem">';
                                            html += '<h4>' + item.formated_date_session + ' - ' + item.ville_session + '</h4>';
                                            html += '<div class="pull-left">';
                                            html += '<p><strong>Date de réunion</strong> : ' + item.formated_date_session + ' / ' + item.heure_session + '</p>';
                                            /*html += '<strong>Lieu de réunion</strong> : ' + item.ville_session + '<br>*/
                                            html += '<p>Tél : ' + item.tel_contact + ' / E-mail : ' + item.mail_contact+'</p>';
                                            html += '</div>';
                                            html += '<div class="pull-right"><a href="'+urlInscription+'">S\'inscrire</a></div>';
                                            html += '</div>';
                                    }
                               });

                                // A COMMENTER SI BDD SAFTI
                                if ($.inArray(villeId, villesId) == -1) {
                                    html += '<div class="noSession">Désolé aucune session n\'existe actuellement pour la ville que vous avez sélectionné.</div>';
                                }
                                
                            }

                            // BDD SAFTI
                            // else
                            // {
                            //     html += '<div class="noSession">Désolé aucune session n\'existe actuellement pour la ville que vous avez sélectionné.</div>';
                            // }

                            // injection de la liste des réunions dans la modal
                            $('#sessions .modal-body').append($(html));
                            // $('#sessions .modal-title').html('Réunions d\'information ' + villeName); // BDD SAFTI

                            // action btn fermer de la modal
                            $('#sessions').on('hidden.bs.modal', function () {
                                $('#sessions .modal-body').empty();
                            })
                        }
                    });
                }

            return false;
        });

        // action btn "retour à la carte"
        $('#retourCarte').on('click', function() {

            usemap.filtreVilles(); // lance fonction de filtrage des villes

            // affiche toutes les régions
            $.each(regions, function(index, val) {
                $('path[data-id="'+val+'"]').show();

                if ($.inArray(val, DOM) > -1) {
                    $('path[data-id="'+val+'"]').css('opacity', '0.5');
                    $('path[data-id="'+val+'"]').hover(function() {
                        $(this).css('opacity', '1');
                    }, function() {
                        $(this).css('opacity', '0.5');
                    });
                }
            });

            // rend invisibles tous les départements
            $.each(ALLdepartments, function(index, val) {
                $('path[data-id="'+val+'"]').hide();
            });

            // rend invisible le nom des villes
            $.each(villes, function(index, val) {
                $('text[data-id="'+val+'"]').hide();
                $('circle[data-id="'+val+'"]').show();
            });

            $(this).hide(); // cache le btn lui-même
            $('circle, text').css('cursor', 'auto'); // curseur normal survol des villes
            $('path').css('cursor', 'pointer'); // curseur "main" survol des régions
            $('#legende').empty(); // efface la légende la région précédemment clickée
            $(".map").removeClass('zoom');
            // reset du positionnement top et left du SVG
            $('svg').css({
                left: '-0.5px',
                top: '0'
            });

            // efface la liste des réunions d'une ville clickée
            // $('#sessions').remove();

            // dézoom
            var coords = $.fn.mapael.maps.map_france.getCoords(46.227638, 2.213749);
            $maparea.trigger('zoom', [0, coords.x, coords.y]);

        });

    });
});
