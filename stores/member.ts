export const useMemberStore = defineStore('member', {
    state: () => ({
        currentMember: null,
    }),
    actions: {
        setMember(data) {
            this.currentMember = data;
        },
        clearMember() {
            this.currentMember = null;
        },
    },
});
