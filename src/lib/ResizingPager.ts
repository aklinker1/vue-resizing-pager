import { defineComponent, h, onMounted, ref, Slot, watch } from "vue";

export default defineComponent({
  name: "ResizingPager",
  props: {
    page: { type: Number, required: true },
    duration: { type: Number, default: 500 },
  },
  setup(props, { slots }) {
    const id = `resizing-pager-${Math.floor(Math.random() * 10000)}`;
    const pageId = (page: number) => `${id}-page-${page}`;
    const prevPage = ref(props.page);

    const animationState =
      ref<"init" | "done" | "starting" | "started">("init");
    onMounted(() => {
      animationState.value = "init";
      updateSizes(props.page);
    });

    const width = ref(0);
    const height = ref(0);
    const containerRef = ref();
    watch(containerRef, (newRef, oldRef) => {
      if (oldRef == null && newRef != null) {
        updateSizes(props.page);
      }
    });
    const updateSizes = (page: number) => {
      const activePageId = pageId(page);
      const activePage = document.querySelector(
        `#${activePageId} > *`
      ) as HTMLDivElement;
      if (activePage != null) {
        width.value = activePage.clientWidth;
        height.value = activePage.clientHeight;
      } else {
        console.warn(`Could not find element #${activePageId}`);
      }
    };

    const changePageTimeout = ref<number | undefined>();
    watch(
      () => props.page,
      (newPage, oldPage) => {
        prevPage.value = oldPage;
        animationState.value = "starting";

        setTimeout(() => {
          updateSizes(newPage);

          setTimeout(() => {
            animationState.value = "started";

            if (changePageTimeout.value != null)
              clearTimeout(changePageTimeout.value);

            changePageTimeout.value = setTimeout(() => {
              prevPage.value = newPage;
              animationState.value = "done";
            }, props.duration);
          }, 0);
        }, 0);
      }
    );

    const getActiveSlots = (): Array<{ slot: Slot; page: number }> => {
      const currentPageInfo = { slot: slots[props.page], page: props.page };
      const prevPageInfo = {
        slot: slots[prevPage.value],
        page: prevPage.value,
      };
      if (currentPageInfo.slot == null && prevPageInfo.slot == null) return [];

      let renderedSlots: Array<{ slot: Slot | undefined; page: number }>;
      if (prevPageInfo.slot === currentPageInfo.slot) {
        renderedSlots = [currentPageInfo];
      } else {
        renderedSlots =
          props.page < prevPage.value
            ? [currentPageInfo, prevPageInfo]
            : [prevPageInfo, currentPageInfo];
      }
      return renderedSlots.filter((s) => s != null) as Array<{
        slot: Slot;
        page: number;
      }>;
    };

    return () => {
      const activeSlots = getActiveSlots();
      return h(
        "div",
        {
          id,
          style: {
            position: "relative",
            overflow: "hidden",
            backgroundColor: "green",
            ...(animationState.value === "init"
              ? undefined
              : {
                  transitionProperty: "width, height",
                  transitionDuration: `${props.duration}ms`,
                  transitionTimingFunction: "ease",
                }),
            width: `${width.value}px`,
            height: `${height.value}px`,
          },
        },
        activeSlots.map(({ slot, page }) => {
          let transform: string | undefined;
          let transitionProperty: string | undefined;
          let transitionDuration: string | undefined;
          let transitionTimingFunction: string | undefined;
          if (
            animationState.value === "done" ||
            animationState.value === "init"
          ) {
            // At rest
            transform = "translateX(0%)";
          } else if (animationState.value === "starting") {
            // Starting positions
            if (page === props.page) {
              if (page < prevPage.value) transform = "translateX(-100%)";
              else transform = "translateX(100%)";
            } else {
              transform = "translateX(0%)";
            }
          } else if (animationState.value === "started") {
            // Ending positions
            transitionDuration = `${props.duration}ms`;
            transitionProperty = "transform";
            if (page === prevPage.value) {
              if (page < props.page) transform = "translateX(-100%)";
              else transform = "translateX(100%)";
            } else {
              transform = "translateX(0%)";
            }
          }
          return h(
            "div",
            {
              id: pageId(page),
              ref: containerRef,
              style: {
                position: "absolute",
                left: 0,
                top: 0,
                transitionProperty,
                transitionDuration,
                transitionTimingFunction,
                transform,
              },
            },
            slot()
          );
        })
      );
    };
  },
});
