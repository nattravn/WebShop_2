namespace WebAPI.Services
{
    public class ValueService
    {
        private string secretValue = "empty";

        public void setSecretValue(string secret)
        {
            secretValue = secret;
        }

        public string getSecretValue()
        {
            return secretValue;
        }
    }
}
