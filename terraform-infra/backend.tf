terraform {
  backend "s3" {
    bucket         = "235494811179"
    key            = "prod/terraform.tfstate"
    region         = "us-east-2"
    encrypt        = true
  }
}
