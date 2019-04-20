module.exports = ((dateOfBirth, res) => {
    try {
        var diff_ms = new Date().getTime() - dateOfBirth.getTime();
        var age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getFullYear() - 1970);
    } catch (error) {
        return res.status(404).json({
            message: 'Not found'
        });
    }
})