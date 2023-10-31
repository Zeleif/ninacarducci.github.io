(function ($) {
    $.fn.mauGallery = function (options) {
        options = $.extend($.fn.mauGallery.defaults, options);
        var tags = [];

        return this.each(function () {
            $.fn.mauGallery.methods.createRowWrapper($(this));

            if (options.lightBox) {
                $.fn.mauGallery.methods.createLightBox($(this), options.lightboxId, options.navigation);
            }

            $.fn.mauGallery.listeners(options);

            $(this).children(".gallery-item").each(function () {
                $.fn.mauGallery.methods.responsiveImageItem($(this));
                $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
                $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);

                var tag = $(this).data("gallery-tag");

                if (options.showTags && tag !== undefined && tags.indexOf(tag) === -1) {
                    tags.push(tag);
                }
            });

            if (options.showTags) {
                $.fn.mauGallery.methods.showItemTags($(this), options.tagsPosition, tags);
            }

            $(this).fadeIn(500);
        });
    };

    $.fn.mauGallery.defaults = {
        columns: 3,
        lightBox: true,
        lightboxId: null,
        showTags: true,
        tagsPosition: "bottom",
        navigation: true,
    };

    $.fn.mauGallery.listeners = function (options) {
        $(".gallery-item").on("click", function () {
            if (options.lightBox && $(this).prop("tagName") === "IMG") {
                $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
            }
        });

        $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
        $(".gallery").on("click", ".mg-prev", () => $.fn.mauGallery.methods.prevImage(options.lightboxId));
        $(".gallery").on("click", ".mg-next", () => $.fn.mauGallery.methods.nextImage(options.lightboxId));
    };

    $.fn.mauGallery.methods = {
        createRowWrapper: function (element) {
            if (!element.children().first().hasClass("row")) {
                element.append('<div class="gallery-items-row row"></div>');
            }
        },

        wrapItemInColumn: function (element, columns) {
            if (columns.constructor === Number) {
                element.wrap(`<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`);
            } else if (columns.constructor === Object) {
                let classes = "";

                if (columns.xs) {
                    classes += ` col-${Math.ceil(12 / columns.xs)}`;
                }

                if (columns.sm) {
                    classes += ` col-sm-${Math.ceil(12 / columns.sm)}`;
                }

                if (columns.md) {
                    classes += ` col-md-${Math.ceil(12 / columns.md)}`;
                }

                if (columns.lg) {
                    classes += ` col-lg-${Math.ceil(12 / columns.lg)}`;
                }

                if (columns.xl) {
                    classes += ` col-xl-${Math.ceil(12 / columns.xl)}`;
                }

                element.wrap(`<div class='item-column mb-4${classes}'></div>`);
            } else {
                console.error(`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`);
            }
        },

        moveItemInRowWrapper: function (element) {
            element.appendTo(".gallery-items-row");
        },

        responsiveImageItem: function (element) {
            if (element.prop("tagName") === "IMG") {
                element.addClass("img-fluid");
            }
        },

        openLightBox: function (element, lightboxId) {
            $(`#${lightboxId}`).find(".lightboxImage").attr("src", element.attr("src"));
            $(`#${lightboxId}`).modal("toggle");
        },

        prevImage: function (lightboxId) {
            let currentImage = null;

            $("img.gallery-item").each(function () {
                if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
                    currentImage = $(this);
                }
            });

            let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
            let imageList = [];

            if (activeTag === "all") {
                $(".item-column").each(function () {
                    if ($(this).children("img").length) {
                        imageList.push($(this).children("img"));
                    }
                });
            } else {
                $(".item-column").each(function () {
                    if ($(this).children("img").data("gallery-tag") === activeTag) {
                        imageList.push($(this).children("img"));
                    }
                });
            }

            let currentIndex = 0;
            let nextImage = null;

            $(imageList).each(function (index) {
                if (currentImage.attr("src") === $(this).attr("src")) {
                    currentIndex = index;
                }
            });

            nextImage = imageList[--currentIndex] || imageList[imageList.length - 1];
            $(".lightboxImage").attr("src", nextImage.attr("src"));
        },

        nextImage: function (lightboxId) {
            let currentImage = null;

            $("img.gallery-item").each(function () {
                if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
                    currentImage = $(this);
                }
            });

            let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
            let imageList = [];

            if (activeTag === "all") {
                $(".item-column").each(function () {
                    if ($(this).children("img").length) {
                        imageList.push($(this).children("img"));
                    }
                });
            } else {
                $(".item-column").each(function () {
                    if ($(this).children("img").data("gallery-tag") === activeTag) {
                        imageList.push($(this).children("img"));
                    }
                });
            }

            let currentIndex = 0;
            let nextImage = null;

            $(imageList).each(function (index) {
                if (currentImage.attr("src") === $(this).attr("src")) {
                    currentIndex = index;
                }
            });

            nextImage = imageList[++currentIndex] || imageList[0];
            $(".lightboxImage").attr("src", nextImage.attr("src"));
        },

        createLightBox: function (element, lightboxId, navigation) {
            element.append(`
                <div class="modal fade" id="${lightboxId || "galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-body">
                                ${navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>' : '<span style="display:none;" />'}
                                <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                                ${navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>' : '<span style="display:none;" />'}
                            </div>
                        </div>
                    </div>
                </div>`);
        },

        showItemTags: function (element, tagsPosition, tags) {
            var tagList = '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';

            $.each(tags, function (index, tag) {
                tagList += `
                    <li class="nav-item active">
                        <span class="nav-link"  data-images-toggle="${tag}">${tag}</span>
                    </li>`;
            });

            var tagBar = `<ul class="my-4 tags-bar nav nav-pills">${tagList}</ul>`;

            if (tagsPosition === "bottom") {
                element.append(tagBar);
            } else if (tagsPosition === "top") {
                element.prepend(tagBar);
            } else {
                console.error(`Unknown tags position: ${tagsPosition}`);
            }
        },

        filterByTag: function () {
            if (!$(this).hasClass("active-tag")) {
                $(".active.active-tag").removeClass("active active-tag");
                $(this).addClass("active-tag active");
                var tag = $(this).data("images-toggle");

                $(".gallery-item").each(function () {
                    $(this).parents(".item-column").hide();

                    if (tag === "all" || $(this).data("gallery-tag") === tag) {
                        $(this).parents(".item-column").show(300);
                    }
                });
            }
        },
    };
})(jQuery);
